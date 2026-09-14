import { notFound } from "next/navigation";
import { getOrderForBackOffice } from "@/backend/services/order.service";
import {
  AdminOrderBillCard,
  AdminOrderCustomerCard,
  AdminOrderDetailHeader,
  AdminOrderItemsCard,
  AdminOrderPaymentCard,
  AdminOrderStatusCard,
} from "@/components/admin/admin-order-detail-i18n";
import { getAdminContext } from "@/components/admin/data";
import { Notice } from "@/components/admin/ui";

type OrderDetailProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function OrderDetailPage({ params, searchParams }: OrderDetailProps) {
  const [{ id }, query, context] = await Promise.all([params, searchParams, getAdminContext()]);
  if (context.state !== "ready") return null;

  // Which buttons appear comes from the shared lifecycle rules, and the same
  // rules are re-checked in the service when the form is submitted.
  const { order, items, transitions, printJob, error } = await getOrderForBackOffice(id);
  if (!order && !error) notFound();

  const addressData = order?.delivery_address;
  const addressObject =
    addressData && typeof addressData === "object" && !Array.isArray(addressData)
      ? (addressData as Record<string, unknown>)
      : null;
  const locationUrl =
    (typeof addressObject?.locationUrl === "string" && addressObject.locationUrl) ||
    (order?.address_line2 && /^https?:\/\//i.test(order.address_line2)
      ? order.address_line2
      : null);
  const address = addressObject
    ? [
        addressObject.street && addressObject.houseNumber
          ? `${addressObject.street} ${addressObject.houseNumber}`
          : addressObject.street,
        [addressObject.postalCode, addressObject.city].filter(Boolean).join(" "),
      ]
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join(", ")
    : [order?.address_line1, order?.postal_code, order?.city]
        .filter(Boolean)
        .join(", ");

  return (
    <>
      <AdminOrderDetailHeader
        id={id}
        orderNumber={order?.order_number}
        createdAt={order?.created_at}
      />
      <Notice message={query.message} error={query.error ?? error ?? undefined} />

      {order ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <AdminOrderStatusCard
              orderId={order.id}
              status={order.status}
              transitions={transitions}
            />

            <AdminOrderBillCard
              orderId={order.id}
              printJob={
                printJob
                  ? {
                      status: printJob.status,
                      attempts: printJob.attempts,
                      max_attempts: printJob.max_attempts,
                      printed_at: printJob.printed_at ?? null,
                      next_attempt_at: printJob.next_attempt_at ?? null,
                      last_error: printJob.last_error ?? null,
                    }
                  : null
              }
            />

            <AdminOrderItemsCard
              items={items.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                notes: item.notes ?? null,
                line_total: item.line_total ?? null,
              }))}
              subtotal={order.subtotal ?? null}
              deliveryFee={order.delivery_fee ?? null}
              total={order.total ?? null}
            />
          </div>

          <div className="space-y-5">
            <AdminOrderCustomerCard
              name={order.customer_name ?? null}
              email={order.customer_email ?? null}
              phone={order.customer_phone ?? null}
              fulfillmentType={order.fulfillment_type ?? null}
              address={address}
              locationUrl={locationUrl}
              notes={order.customer_notes ?? null}
            />
            <AdminOrderPaymentCard
              method={order.payment_method ?? null}
              status={order.payment_status ?? null}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
