import { describe, expect, it } from "vitest";
import { optimizedPhotoUrl } from "@/data/image-renditions";
import { heroSlides } from "@/data/hero-slideshow";
import firstPhoto from "@/assets/optimized/Bag_Filter_Dust_Collectors-2.webp.asset.json";
import { SITE_URL, pageSeo } from "@/lib/seo";

describe("Approved performance preservation", () => {
  it("maps the original first slideshow photo to its smaller rendition", () => {
    expect(optimizedPhotoUrl(heroSlides[0].src)).toBe(firstPhoto.url);
    expect(firstPhoto.size).toBeLessThan(116625);
  });
  it("preserves administrator-uploaded photo URLs", () => {
    const upload = "/api/public/hero-photo/12345678-1234-1234-1234-123456789abc.jpg";
    expect(optimizedPhotoUrl(upload)).toBe(upload);
  });
  it("keeps search metadata ready for handlair.co.in", () => {
    expect(SITE_URL).toBe("https://www.handlair.co.in");
    expect(pageSeo("/products", "Products", "Equipment").links[0]?.href).toBe(
      "https://www.handlair.co.in/products",
    );
  });
});
