import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  allowedTransitionsFor,
  assertTransition,
  canTransition,
  isOrderStatus,
  ORDER_STATUSES,
} from "@/backend/domain/order-status";
import { ConflictError, ValidationError } from "@/backend/errors";

describe("order lifecycle", () => {
  it("only allows the documented forward transitions", () => {
    assert.equal(canTransition("pending", "confirmed"), true);
    assert.equal(canTransition("confirmed", "preparing"), true);
    assert.equal(canTransition("preparing", "ready"), true);
    assert.equal(canTransition("ready", "out_for_delivery"), true);
    assert.equal(canTransition("out_for_delivery", "completed"), true);
  });

  it("refuses to skip steps or move backwards", () => {
    assert.equal(canTransition("pending", "completed"), false);
    assert.equal(canTransition("pending", "preparing"), false);
    assert.equal(canTransition("confirmed", "pending"), false);
    assert.equal(canTransition("completed", "preparing"), false);
  });

  it("treats completed and cancelled as terminal", () => {
    for (const status of ORDER_STATUSES) {
      assert.equal(canTransition("completed", status), false);
      assert.equal(canTransition("cancelled", status), false);
    }
  });

  it("stops accepting cancellations once the order has left the kitchen", () => {
    assert.equal(canTransition("preparing", "cancelled"), true);
    assert.equal(canTransition("ready", "cancelled"), false);
    assert.equal(canTransition("out_for_delivery", "cancelled"), false);
  });

  it("rejects values that are not statuses at all", () => {
    assert.equal(isOrderStatus("delivered"), false);
    assert.equal(isOrderStatus(""), false);
    assert.equal(isOrderStatus(undefined), false);
    assert.throws(
      () => assertTransition("pending", "shipped", "restaurant_admin"),
      ValidationError,
    );
  });

  it("blocks a valid status that the role may not set", () => {
    // Handing an order to a rider needs `riders:assign`, which staff lack.
    assert.throws(
      () => assertTransition("ready", "out_for_delivery", "restaurant_staff"),
      ConflictError,
    );
    assert.equal(
      assertTransition("ready", "out_for_delivery", "restaurant_admin"),
      "out_for_delivery",
    );
  });

  it("gives customers and riders no kitchen transitions", () => {
    assert.deepEqual(allowedTransitionsFor("customer", "pending"), []);
    assert.deepEqual(allowedTransitionsFor("rider", "preparing"), []);
    assert.deepEqual(allowedTransitionsFor(null, "pending"), []);
    assert.throws(
      () => assertTransition("pending", "confirmed", "customer"),
      ConflictError,
    );
  });

  it("offers staff the kitchen steps and admins the handover as well", () => {
    assert.deepEqual(allowedTransitionsFor("restaurant_staff", "ready"), [
      "completed",
    ]);
    assert.deepEqual(allowedTransitionsFor("restaurant_admin", "ready"), [
      "out_for_delivery",
      "completed",
    ]);
  });
});
