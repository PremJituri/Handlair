import { describe, it, expect } from "vitest";
import { canDeleteCategory, MAX_UPLOAD_BYTES, MAX_IMAGE_WIDTH, slugSchema } from "@/lib/cms-schema";
describe("CMS integrity", () => {
  it("blocks deletion of assigned categories", () => {
    expect(canDeleteCategory(1)).toBe(false);
    expect(canDeleteCategory(5)).toBe(false);
    expect(canDeleteCategory(0)).toBe(true);
  });
  it("limits uploaded photographs to 200 KB", () => {
    expect(MAX_UPLOAD_BYTES).toBe(200_000);
  });
  it("limits photo width to full HD", () => {
    expect(MAX_IMAGE_WIDTH).toBe(1920);
  });
  it("requires URL-safe slugs", () => {
    expect(slugSchema.safeParse("air-cooling-units").success).toBe(true);
    expect(slugSchema.safeParse("../admin").success).toBe(false);
  });
});
import { slugify } from "@/lib/cms-schema";
describe("category slugs", () => {
  it("builds valid slugs from names", () => {
    expect(slugify("Heat Exchangers & Coils")).toBe("heat-exchangers-and-coils");
    expect(slugSchema.safeParse(slugify("  New Category! ")).success).toBe(true);
  });
});
