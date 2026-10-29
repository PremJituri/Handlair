import { describe, it, expect } from "vitest";
import { assertCanDeleteHeroSlide, heroImageUrlSchema } from "@/lib/hero-slides";

describe("Hero photo safeguards", () => {
  it("requires at least one photo after deletion", () => {
    expect(() => assertCanDeleteHeroSlide(1)).toThrow(
      "Cannot delete the last photo. Minimum 1 photo required.",
    );
    expect(() => assertCanDeleteHeroSlide(0)).toThrow(
      "Cannot delete the last photo. Minimum 1 photo required.",
    );
    expect(() => assertCanDeleteHeroSlide(2)).not.toThrow();
  });
  it("accepts only managed hero photo URLs", () => {
    expect(
      heroImageUrlSchema.safeParse(
        "/api/public/hero-photo/12345678-1234-1234-1234-123456789abc.jpg",
      ).success,
    ).toBe(true);
    expect(heroImageUrlSchema.safeParse("https://example.com/photo.jpg").success).toBe(false);
    expect(
      heroImageUrlSchema.safeParse(
        "/api/public/product-photo/12345678-1234-1234-1234-123456789abc.jpg",
      ).success,
    ).toBe(false);
  });
});
