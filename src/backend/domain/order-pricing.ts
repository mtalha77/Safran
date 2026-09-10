import { ConflictError } from "@/backend/errors";

export type Fulfillment = "delivery" | "pickup";

/** A cart line after the server has replaced the client's price with the real one. */
export type PricedLine = {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type PricingRules = {
  deliveryFee: number;
  deliveryMinimum: number;
  pickupMinimum: number;
};

export type OrderTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

/**
 * Rounds to whole cents so stored numerics and shown prices always agree.
 *
 * The `toFixed` step absorbs binary float error before rounding, so a value
 * such as 1.005 (which is really 1.00499999…) still becomes 1.01.
 */
export function money(value: unknown): number {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(Number((amount * 100).toFixed(4))) / 100;
}

export function lineTotal(line: Pick<PricedLine, "quantity" | "unitPrice">): number {
  return money(money(line.unitPrice) * line.quantity);
}

/**
 * Authoritative total. Prices and fees come from the database, never from the
 * client, so a tampered cart cannot change what is charged.
 */
export function calculateOrderTotals(
  lines: readonly PricedLine[],
  fulfillment: Fulfillment,
  rules: PricingRules,
): OrderTotals {
  const subtotal = money(
    lines.reduce((sum, line) => sum + lineTotal(line), 0),
  );
  const deliveryFee =
    fulfillment === "delivery" ? Math.max(0, money(rules.deliveryFee)) : 0;

  return { subtotal, deliveryFee, total: money(subtotal + deliveryFee) };
}

export function minimumFor(fulfillment: Fulfillment, rules: PricingRules): number {
  return Math.max(
    0,
    money(fulfillment === "delivery" ? rules.deliveryMinimum : rules.pickupMinimum),
  );
}

export function assertMinimumOrder(
  subtotal: number,
  fulfillment: Fulfillment,
  rules: PricingRules,
): void {
  const minimum = minimumFor(fulfillment, rules);
  if (subtotal < minimum) {
    throw new ConflictError(
      "minimum_not_met",
      `Der Mindestbestellwert beträgt CHF ${minimum.toFixed(2)}.`,
    );
  }
}
