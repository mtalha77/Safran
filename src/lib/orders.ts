import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/service";

export type Fulfillment = "delivery" | "pickup";
export type PaymentMethod = "cash";

export type OrderRequest = {
  idempotencyKey: string;
  fulfillment: Fulfillment;
  paymentMethod: PaymentMethod;
  acceptedNoCancellation: boolean;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address?: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  notes?: string;
  items: Array<{ id: string; quantity: number }>;
};

export type CreatedOrder = {
  orderNumber: string;
  confirmationToken: string;
  total: number;
  currency: "CHF";
  status: string;
};

export class OrderError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const money = (value: unknown) => Math.round(Number(value) * 100) / 100;

export function parseOrderRequest(
  body: unknown,
  headerIdempotencyKey?: string | null,
): OrderRequest {
  if (!body || typeof body !== "object") {
    throw new OrderError(400, "invalid_request", "Ungültige Bestelldaten.");
  }

  const input = body as Record<string, unknown>;
  const customer = (input.customer ?? {}) as Record<string, unknown>;
  const address = (input.address ?? {}) as Record<string, unknown>;
  const fulfillment = input.fulfillment;
  const paymentMethod = input.paymentMethod;
  const bodyKey = text(input.idempotencyKey, 100);
  const headerKey = text(headerIdempotencyKey, 100);
  const idempotencyKey = headerKey || bodyKey;

  if (headerKey && bodyKey && headerKey !== bodyKey) {
    throw new OrderError(
      400,
      "idempotency_mismatch",
      "Die Bestellanfrage ist ungültig.",
    );
  }
  if (!/^[a-zA-Z0-9_-]{16,100}$/.test(idempotencyKey)) {
    throw new OrderError(
      400,
      "invalid_idempotency_key",
      "Die Bestellanfrage ist ungültig.",
    );
  }
  if (fulfillment !== "delivery" && fulfillment !== "pickup") {
    throw new OrderError(400, "invalid_fulfillment", "Ungültige Lieferart.");
  }
  if (paymentMethod !== "cash") {
    throw new OrderError(
      400,
      "payment_unavailable",
      "Online-Zahlung ist derzeit nicht verfügbar.",
    );
  }
  if (input.acceptedNoCancellation !== true) {
    throw new OrderError(
      400,
      "policy_required",
      "Bitte bestätigen Sie die Stornierungsbedingungen.",
    );
  }

  const parsedCustomer = {
    firstName: text(customer.firstName, 80),
    lastName: text(customer.lastName, 80),
    email: text(customer.email, 254).toLowerCase(),
    phone: text(customer.phone, 40),
  };
  if (
    !parsedCustomer.firstName ||
    !parsedCustomer.lastName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsedCustomer.email) ||
    parsedCustomer.phone.length < 6
  ) {
    throw new OrderError(
      400,
      "invalid_customer",
      "Bitte prüfen Sie Ihre Kontaktdaten.",
    );
  }

  const rawItems = Array.isArray(input.items) ? input.items : [];
  const quantities = new Map<string, number>();
  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") continue;
    const item = rawItem as Record<string, unknown>;
    const id = text(item.id, 100);
    const quantity = Number(item.quantity);
    if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw new OrderError(
        400,
        "invalid_items",
        "Der Warenkorb enthält ungültige Artikel.",
      );
    }
    quantities.set(id, (quantities.get(id) ?? 0) + quantity);
  }
  const items = [...quantities].map(([id, quantity]) => ({ id, quantity }));
  if (!items.length || items.length > 50) {
    throw new OrderError(400, "invalid_items", "Ihr Warenkorb ist leer.");
  }

  let parsedAddress: OrderRequest["address"];
  if (fulfillment === "delivery") {
    parsedAddress = {
      street: text(address.street, 120),
      houseNumber: text(address.houseNumber, 20),
      postalCode: text(address.postalCode, 12),
      city: text(address.city, 80),
    };
    if (Object.values(parsedAddress).some((value) => !value)) {
      throw new OrderError(
        400,
        "invalid_address",
        "Bitte geben Sie eine vollständige Lieferadresse an.",
      );
    }
  }

  return {
    idempotencyKey,
    fulfillment,
    paymentMethod,
    acceptedNoCancellation: true,
    customer: parsedCustomer,
    address: parsedAddress,
    notes: text(input.notes, 1000) || undefined,
    items,
  };
}

function publicOrder(row: Record<string, unknown>): CreatedOrder {
  return {
    orderNumber: String(row.order_number),
    confirmationToken: String(row.confirmation_token),
    total: money(row.total),
    currency: "CHF",
    status: String(row.status || "pending"),
  };
}

function shortOrderNumber() {
  const day = new Date().toISOString().slice(5, 10).replace("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase();
  return `${day}-${suffix}`;
}

export async function createCashOrder(
  request: OrderRequest,
): Promise<CreatedOrder> {
  let db: SupabaseClient;
  try {
    db = (await createServiceClient()) as unknown as SupabaseClient;
  } catch {
    throw new OrderError(
      503,
      "ordering_unavailable",
      "Bestellungen sind vorübergehend nicht verfügbar.",
    );
  }

  const duplicate = await db
    .from("orders")
    .select("order_number, confirmation_token, total, status")
    .eq("idempotency_key", request.idempotencyKey)
    .maybeSingle();
  if (duplicate.data) return publicOrder(duplicate.data);

  const settingsResult = await db
    .from("store_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  if (settingsResult.error || !settingsResult.data) {
    throw new OrderError(
      503,
      "ordering_unavailable",
      "Bestellungen sind vorübergehend nicht verfügbar.",
    );
  }
  const settings = settingsResult.data as Record<string, unknown>;
  if (settings.is_open !== true) {
    throw new OrderError(
      409,
      "store_closed",
      text(settings.closed_message, 200) ||
        "Das Restaurant nimmt derzeit keine Bestellungen an.",
    );
  }
  if (
    (request.fulfillment === "delivery" &&
      settings.delivery_enabled !== true) ||
    (request.fulfillment === "pickup" && settings.pickup_enabled !== true)
  ) {
    throw new OrderError(
      409,
      "fulfillment_unavailable",
      "Die gewählte Bestellart ist derzeit nicht verfügbar.",
    );
  }
  const zurichParts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Zurich",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hoursResult = await db
    .from("opening_hours")
    .select("*")
    .eq("day_of_week", weekdays.indexOf(zurichParts.weekday))
    .maybeSingle();
  const now = `${zurichParts.hour}:${zurichParts.minute}`;
  const hours = hoursResult.data as Record<string, unknown> | null;
  const inWindow = (start: unknown, end: unknown) =>
    typeof start === "string" &&
    typeof end === "string" &&
    now >= start.slice(0, 5) &&
    now <= end.slice(0, 5);
  if (
    hoursResult.error ||
    !hours ||
    hours.is_closed === true ||
    (!inWindow(hours.open_time, hours.close_time) &&
      !inWindow(hours.second_open_time, hours.second_close_time))
  ) {
    throw new OrderError(
      409,
      "store_closed",
      "Das Restaurant ist derzeit geschlossen.",
    );
  }

  const itemNumbers = request.items.map((item) => {
    const match = /^menu-(\d+)$/.exec(item.id);
    if (!match) {
      throw new OrderError(
        400,
        "invalid_items",
        "Der Warenkorb enthält ungültige Artikel.",
      );
    }
    return Number(match[1]);
  });
  const menuResult = await db
    .from("menu_items")
    .select("id, number, name, price, is_available")
    .in("number", itemNumbers);
  if (menuResult.error) {
    throw new OrderError(
      503,
      "ordering_unavailable",
      "Die Speisekarte konnte nicht geprüft werden.",
    );
  }

  const menu = new Map<string, Record<string, unknown>>(
    (menuResult.data ?? []).map((row: Record<string, unknown>) => [
      `menu-${row.number}`,
      row,
    ] as [string, Record<string, unknown>]),
  );
  const verifiedItems = request.items.map((item) => {
    const current = menu.get(item.id);
    if (
      !current ||
      current.is_available !== true ||
      !Number.isFinite(Number(current.price))
    ) {
      throw new OrderError(
        409,
        "item_unavailable",
        "Mindestens ein Artikel ist nicht mehr verfügbar.",
      );
    }
    const unitPrice = money(current.price);
    return {
      menu_item_id: String(current.id),
      name: String(current.name),
      quantity: item.quantity,
      unit_price: unitPrice,
      line_total: money(unitPrice * item.quantity),
      notes: null,
    };
  });

  const subtotal = money(
    verifiedItems.reduce((sum, item) => sum + item.line_total, 0),
  );
  const minimum = money(
    request.fulfillment === "delivery"
      ? settings.minimum_order ?? 0
      : 0,
  );
  if (subtotal < minimum) {
    throw new OrderError(
      409,
      "minimum_not_met",
      `Der Mindestbestellwert beträgt CHF ${minimum.toFixed(2)}.`,
    );
  }
  const deliveryFee =
    request.fulfillment === "delivery"
      ? money(settings.delivery_fee ?? 0)
      : 0;
  const total = money(subtotal + deliveryFee);
  const orderNumber = shortOrderNumber();
  const token = crypto.randomUUID();
  const order = {
    order_number: orderNumber,
    confirmation_token: token,
    idempotency_key: request.idempotencyKey,
    status: "pending" as const,
    fulfillment_type: request.fulfillment,
    payment_status: "pending",
    payment_method: "cash",
    accepted_no_cancellation: true,
    customer_name: `${request.customer.firstName} ${request.customer.lastName}`,
    customer_email: request.customer.email,
    customer_phone: request.customer.phone,
    address_line1: request.address
      ? `${request.address.street} ${request.address.houseNumber}`
      : null,
    address_line2: null,
    postal_code: request.address?.postalCode ?? null,
    city: request.address?.city ?? null,
    customer_notes: request.notes ?? null,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    currency: "CHF",
  };

  // Preferred path: a SECURITY DEFINER database function performs all inserts
  // in one transaction and enforces a unique idempotency_key.
  const rpc = await db.rpc("create_cash_order", {
    p_order: order,
    p_items: verifiedItems,
  });
  if (!rpc.error && rpc.data) {
    const row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
    return publicOrder({ ...order, ...(row as Record<string, unknown>) });
  }

  // Deployments without the optional RPC still work. Compensating deletion
  // avoids leaving a partial order when an item/event insert fails.
  const inserted = await db.from("orders").insert(order).select("id").single();
  if (inserted.error) {
    const racedDuplicate = await db
      .from("orders")
      .select("order_number, confirmation_token, total, status")
      .eq("idempotency_key", request.idempotencyKey)
      .maybeSingle();
    if (racedDuplicate.data) return publicOrder(racedDuplicate.data);
    throw new OrderError(503, "order_failed", "Die Bestellung konnte nicht gespeichert werden.");
  }

  const orderId = inserted.data.id;
  const itemsInsert = await db
    .from("order_items")
    .insert(verifiedItems.map((item) => ({ ...item, order_id: orderId })));
  const eventInsert = itemsInsert.error
    ? { error: itemsInsert.error }
    : await db.from("order_status_events").insert({
        order_id: orderId,
        from_status: null,
        to_status: "pending",
        note: "Bestellung eingegangen",
      });
  if (itemsInsert.error || eventInsert.error) {
    await db.from("orders").delete().eq("id", orderId);
    throw new OrderError(503, "order_failed", "Die Bestellung konnte nicht gespeichert werden.");
  }

  return publicOrder(order);
}

export async function getOrderByToken(token: string) {
  if (!/^[a-f0-9-]{36}$/.test(token)) return null;
  try {
    const db = (await createServiceClient()) as unknown as SupabaseClient;
    const orderResult = await db
      .from("orders")
      .select(
        "id, order_number, status, fulfillment_type, payment_status, subtotal, delivery_fee, total, currency, created_at",
      )
      .eq("confirmation_token", token)
      .single();
    if (orderResult.error || !orderResult.data) return null;
    const [items, events] = await Promise.all([
      db
        .from("order_items")
        .select("name, quantity, unit_price, line_total")
        .eq("order_id", orderResult.data.id),
      db
        .from("order_status_events")
        .select("to_status, note, created_at")
        .eq("order_id", orderResult.data.id)
        .order("created_at"),
    ]);
    if (items.error || events.error) return null;
    return {
      ...orderResult.data,
      order_items: items.data ?? [],
      order_status_events: events.data ?? [],
    };
  } catch {
    return null;
  }
}
