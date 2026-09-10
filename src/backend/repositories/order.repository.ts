import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json, OrderStatus } from "@/types/database";

type Db = SupabaseClient<Database>;

export type NewOrderRow = Database["public"]["Tables"]["orders"]["Insert"];
export type NewOrderItemRow = Omit<
  Database["public"]["Tables"]["order_items"]["Insert"],
  "order_id"
>;

export type PersistedOrder = {
  order_number: string;
  confirmation_token: string;
  total: number;
  status: string;
};

export const ORDER_LIST_COLUMNS =
  "id, order_number, customer_name, fulfillment_type, total, status, created_at";

export function findByIdempotencyKey(db: Db, key: string) {
  return db
    .from("orders")
    .select("order_number, confirmation_token, total, status")
    .eq("idempotency_key", key)
    .maybeSingle();
}

/**
 * Order, its lines and its status history in a single round trip. PostgREST
 * embeds the related rows, so the guest confirmation page costs one query
 * rather than one per relation.
 */
export function findByConfirmationToken(db: Db, token: string) {
  return db
    .from("orders")
    .select(
      "id, order_number, status, fulfillment_type, payment_status, subtotal, delivery_fee, total, currency, created_at, order_items(name, quantity, unit_price, line_total), order_status_events(to_status, note, created_at)",
    )
    .eq("confirmation_token", token)
    // Embedded rows have no implicit order, so sort them here to keep the cart
    // lines and the status timeline stable across requests.
    .order("id", { referencedTable: "order_items" })
    .order("created_at", { referencedTable: "order_status_events" })
    .maybeSingle();
}

export function findOrderById(db: Db, orderId: string) {
  return db.from("orders").select("*").eq("id", orderId).maybeSingle();
}

export function findOrderStatus(db: Db, orderId: string) {
  return db.from("orders").select("status").eq("id", orderId).maybeSingle();
}

export function findOrderItems(db: Db, orderId: string) {
  return db.from("order_items").select("*").eq("order_id", orderId).order("id");
}

export type OrderListQuery = {
  status?: OrderStatus;
  search?: string;
  from: number;
  to: number;
};

export function listOrders(db: Db, { status, search, from, to }: OrderListQuery) {
  let query = db
    .from("orders")
    .select(ORDER_LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (search) {
    // PostgREST `or` filters are comma separated, so those characters are stripped.
    const safe = search.replace(/[%_,()]/g, "");
    query = query.or(
      `customer_name.ilike.%${safe}%,order_number.ilike.%${safe}%`,
    );
  }

  return query;
}

export function listRecentOrders(db: Db, limit: number) {
  return db
    .from("orders")
    .select("id, order_number, customer_name, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
}

export function countOrdersSince(db: Db, since: string) {
  return db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
}

/** Status + payment fields needed for dashboard KPIs — no full order rows. */
export function listOrderKpisSince(db: Db, since: string) {
  return db
    .from("orders")
    .select("status, total, payment_method")
    .gte("created_at", since);
}

/**
 * Compare-and-swap status write. The `eq("status", from)` guard makes two
 * concurrent admins racing on the same order safe: the loser updates 0 rows.
 */
export async function updateStatus(
  db: Db,
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
) {
  return db
    .from("orders")
    .update({ status: to, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", from)
    .select("id")
    .maybeSingle();
}

export function insertStatusEvent(
  db: Db,
  event: {
    orderId: string;
    from: OrderStatus | null;
    to: OrderStatus;
    changedBy: string | null;
    note?: string | null;
  },
) {
  return db.from("order_status_events").insert({
    order_id: event.orderId,
    from_status: event.from,
    to_status: event.to,
    changed_by: event.changedBy,
    note: event.note ?? null,
  });
}

/**
 * Writes the order, its lines and the initial status event.
 *
 * Preferred path is the `create_cash_order` SECURITY DEFINER function, which
 * does all three inserts in one transaction and relies on the unique
 * `idempotency_key` to reject duplicates. Deployments without that function fall
 * back to separate inserts plus a compensating delete, so a partial order is
 * never left behind.
 */
export async function insertOrder(
  db: Db,
  order: NewOrderRow,
  lines: NewOrderItemRow[],
): Promise<{ order: PersistedOrder | null; failed: boolean }> {
  const rpc = await db.rpc("create_cash_order", {
    p_order: order as unknown as Json,
    p_items: lines as unknown as Json,
  });

  if (!rpc.error && rpc.data) {
    const row = (Array.isArray(rpc.data) ? rpc.data[0] : rpc.data) as Record<
      string,
      unknown
    >;
    return {
      order: {
        order_number: String(row.order_number ?? order.order_number),
        confirmation_token: String(
          row.confirmation_token ?? order.confirmation_token,
        ),
        total: Number(row.total ?? order.total),
        status: String(row.status ?? "pending"),
      },
      failed: false,
    };
  }

  const inserted = await db.from("orders").insert(order).select("id").single();
  if (inserted.error) {
    const raced = await findByIdempotencyKey(db, String(order.idempotency_key));
    if (raced.data) {
      return { order: raced.data as PersistedOrder, failed: false };
    }
    return { order: null, failed: true };
  }

  const orderId = inserted.data.id;
  const itemsInsert = await db
    .from("order_items")
    .insert(lines.map((line) => ({ ...line, order_id: orderId })));
  const eventInsert = itemsInsert.error
    ? { error: itemsInsert.error }
    : await insertStatusEvent(db, {
        orderId,
        from: null,
        to: "pending",
        changedBy: null,
        note: "Bestellung eingegangen",
      });

  if (itemsInsert.error || eventInsert.error) {
    await db.from("orders").delete().eq("id", orderId);
    return { order: null, failed: true };
  }

  return {
    order: {
      order_number: String(order.order_number),
      confirmation_token: String(order.confirmation_token),
      total: Number(order.total),
      status: "pending",
    },
    failed: false,
  };
}
