import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  progressStagesFor,
  toCustomerOrderStage,
} from "../order-status.adapter";

describe("toCustomerOrderStage", () => {
  it("maps backend statuses used by Safran", () => {
    assert.equal(toCustomerOrderStage("pending"), "confirmed");
    assert.equal(toCustomerOrderStage("confirmed"), "confirmed");
    assert.equal(toCustomerOrderStage("preparing"), "preparing");
    assert.equal(toCustomerOrderStage("ready"), "ready");
    assert.equal(toCustomerOrderStage("out_for_delivery"), "delivering");
    assert.equal(toCustomerOrderStage("completed"), "completed");
    assert.equal(toCustomerOrderStage("cancelled"), "cancelled");
  });

  it("normalizes aliases and separators", () => {
    assert.equal(toCustomerOrderStage("RECEIVED"), "confirmed");
    assert.equal(toCustomerOrderStage("in-kitchen"), "preparing");
    assert.equal(toCustomerOrderStage("Awaiting Pickup"), "ready");
    assert.equal(toCustomerOrderStage("out for delivery"), "delivering");
    assert.equal(toCustomerOrderStage("delivered"), "completed");
    assert.equal(toCustomerOrderStage("canceled"), "cancelled");
    assert.equal(toCustomerOrderStage("rejected"), "cancelled");
  });

  it("never promotes unknown values into a success stage", () => {
    assert.equal(toCustomerOrderStage("totally_made_up"), "unknown");
    assert.equal(toCustomerOrderStage(""), "unknown");
    assert.equal(toCustomerOrderStage(null), "unknown");
    assert.equal(toCustomerOrderStage(undefined), "unknown");
  });
});

describe("progressStagesFor", () => {
  it("omits delivering for pickup orders", () => {
    assert.deepEqual(progressStagesFor("pickup"), [
      "confirmed",
      "preparing",
      "ready",
      "completed",
    ]);
  });

  it("keeps the full delivery sequence", () => {
    assert.deepEqual(progressStagesFor("delivery"), [
      "confirmed",
      "preparing",
      "ready",
      "delivering",
      "completed",
    ]);
  });
});
