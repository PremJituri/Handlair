import { describe, expect, it } from "vitest";
import { adminSessionCookie } from "@/lib/admin-session-cookie";

describe("admin session cookies", () => {
  it("keeps the encrypted session available in HTTPS embedded previews", () => {
    expect(adminSessionCookie("https://handlair.example/admin/login")).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
      path: "/",
    });
  });
  it("recognizes HTTPS behind the hosting proxy", () => {
    expect(adminSessionCookie("http://internal/admin/login", "https").secure).toBe(true);
    expect(adminSessionCookie("http://internal/admin/login", "https").partitioned).toBe(true);
  });
  it("keeps local HTTP sessions strict and usable", () => {
    expect(adminSessionCookie("http://localhost:8080/admin/login")).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      partitioned: false,
      path: "/",
    });
  });
});
