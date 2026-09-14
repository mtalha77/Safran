"use client";

import Link from "next/link";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { OrderStatusBadge, useActionLabel } from "@/components/admin/t";
import {
  Card,
  PageHeader,
  secondaryButtonClass,
} from "@/components/admin/ui";
import { PendingSubmitButton } from "@/components/admin/pending-submit-button";
import { useLocale } from "@/lib/i18n/locale-context";

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "–";
  return new Intl.DateTimeFormat(locale === "en" ? "en-CH" : "de-CH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminOrderDetailHeader({
  id,
  orderNumber,
  createdAt,
}: {
  id: string;
  orderNumber: string | number | null | undefined;
  createdAt: string | null | undefined;
}) {
  const { t, locale } = useLocale();
  const n = orderNumber ?? String(id).slice(0, 8);

  return (
    <PageHeader
      eyebrow={t("admin.detail.eyebrow")}
      title={t("admin.detail.title", { n })}
      description={t("admin.detail.received", {
        date: formatDate(createdAt, locale),
      })}
      action={
        <Link href="/admin/orders" className={secondaryButtonClass}>
          {t("admin.detail.back")}
        </Link>
      }
    />
  );
}

export function AdminOrderStatusCard({
  orderId,
  status,
  transitions,
}: {
  orderId: string;
  status: string;
  transitions: string[];
}) {
  const { t } = useLocale();
  const actionLabel = useActionLabel();

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wider text-muted uppercase">
            {t("admin.detail.currentStatus")}
          </p>
          <div className="mt-2">
            <OrderStatusBadge status={status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {transitions.map((next) => (
            <form action={updateOrderStatusAction} key={next}>
              <input type="hidden" name="id" value={orderId} />
              <input type="hidden" name="status" value={next} />
              <PendingSubmitButton
                variant={next === "cancelled" ? "danger" : "primary"}
                pendingLabel={t("admin.detail.updating")}
              >
                {actionLabel(next)}
              </PendingSubmitButton>
            </form>
          ))}
        </div>
      </div>
    </Card>
  );
}
