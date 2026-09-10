import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { can, isBackOfficeRole, normalizeRole } from "@/backend/domain/roles";

describe("role authorization", () => {
  it("maps the legacy admin value onto the restaurant admin role", () => {
    assert.equal(normalizeRole("admin"), "restaurant_admin");
    assert.equal(normalizeRole("restaurant_admin"), "restaurant_admin");
  });

  it("rejects anything that is not a known role", () => {
    assert.equal(normalizeRole("superuser"), null);
    assert.equal(normalizeRole(""), null);
    assert.equal(normalizeRole(undefined), null);
    assert.equal(normalizeRole(true), null);
    assert.equal(normalizeRole({ role: "admin" }), null);
  });

  it("gives customers no back-office capability", () => {
    assert.equal(isBackOfficeRole("customer"), false);
    assert.equal(can("customer", "orders:read"), false);
    assert.equal(can("customer", "menu:manage"), false);
    assert.equal(can("customer", "settings:manage"), false);
  });

  it("gives an anonymous caller nothing", () => {
    assert.equal(isBackOfficeRole(null), false);
    assert.equal(can(null, "orders:read"), false);
    assert.equal(can(null, "menu:manage"), false);
  });

  it("lets kitchen staff work orders but not the menu or settings", () => {
    assert.equal(can("restaurant_staff", "orders:read"), true);
    assert.equal(can("restaurant_staff", "orders:transition"), true);
    assert.equal(can("restaurant_staff", "menu:manage"), false);
    assert.equal(can("restaurant_staff", "settings:manage"), false);
    assert.equal(can("restaurant_staff", "riders:assign"), false);
  });

  it("keeps riders out of the back office", () => {
    assert.equal(isBackOfficeRole("rider"), false);
    assert.equal(can("rider", "deliveries:handle"), true);
    assert.equal(can("rider", "orders:read"), false);
    assert.equal(can("rider", "menu:manage"), false);
  });

  it("grants restaurant and platform admins the management capabilities", () => {
    for (const role of ["restaurant_admin", "platform_admin"] as const) {
      assert.equal(isBackOfficeRole(role), true);
      assert.equal(can(role, "menu:manage"), true);
      assert.equal(can(role, "settings:manage"), true);
      assert.equal(can(role, "riders:assign"), true);
    }
  });
});
