import { describe, expect, it } from "vitest";
import { catalogueProducts, filterCatalogue, findCatalogueProduct } from "@/data/product-catalogue";
import { products, gallery } from "@/data/handlair";

describe("Owner-specified product hierarchy", () => {
  it("groups the four air cooling / ventilation subcategories", () => {
    expect(filterCatalogue("air").map((item) => item.subcategory)).toEqual(["Centrifugal Blowers", "Axial Flow Fans", "Roof Extractors", "Man Coolers"]);
  });
  it("places air cooling and the four dust-control subcategories in Dust Collection", () => {
    expect(filterCatalogue("dust").map((item) => item.subcategory)).toEqual(["Air Cooling Systems", "Bag Type Dust Collectors", "Cyclone Dust Collectors", "Spray Scrubbers", "Venturi Scrubbers"]);
  });
  it("exposes the three filter subcategories", () => {
    expect(filterCatalogue("filters").map((item) => item.subcategory)).toEqual(["Pre-Filters", "Fine Filters & HEPA Filters", "Oil Bath Pre-Filters"]);
  });
  it("returns the full catalogue and isolates selected subcategories", () => {
    expect(filterCatalogue("all")).toHaveLength(12);
    expect(filterCatalogue("dust", "air-cooling-units").map((item) => item.slug)).toEqual(["air-cooling-units"]);
    expect(filterCatalogue("air", "air-cooling-units")).toHaveLength(0);
  });
  it("preserves existing product names, technical facts and URLs", () => {
    for (const original of products) {
      const mapped = findCatalogueProduct(original.slug);
      expect(mapped?.name).toBe(original.name);
      expect(mapped?.detail).toBe(original.detail);
      expect(mapped?.specifications).toEqual(original.specifications);
    }
  });
  it("keeps cooling imagery exclusively associated with cooling products", () => {
    const coolingImages = gallery.filter((item) => item.category === "Air Cooling").map((item) => item.image);
    const cooling = findCatalogueProduct("air-cooling-units");
    expect(cooling?.images.map((item) => item.src)).toEqual(expect.arrayContaining(coolingImages));
    for (const product of catalogueProducts.filter((item) => item.slug !== "air-cooling-units")) {
      expect(product.images.some((item) => coolingImages.includes(item.src))).toBe(false);
    }
  });
  it("does not assign ambiguous family photos or invent HEPA specifications", () => {
    for (const slug of ["spray-scrubbers", "venturi-scrubbers", "pre-filters", "fine-hepa-filters", "oil-bath-pre-filters"]) expect(findCatalogueProduct(slug)?.images).toEqual([]);
    expect(findCatalogueProduct("fine-hepa-filters")?.specifications).toBeUndefined();
    expect(findCatalogueProduct("fine-hepa-filters")?.detail).toBe("");
    expect(findCatalogueProduct("unknown")).toBeUndefined();
  });
});