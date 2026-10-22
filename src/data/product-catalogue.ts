import { gallery, products, showcase, type Product } from "@/data/handlair";

export const catalogueCategories = [
  { id: "air", name: "Air Cooling / Ventilation Systems" },
  { id: "dust", name: "Dust Collection Systems" },
  { id: "filters", name: "Filters" },
] as const;

export type CatalogueCategory = (typeof catalogueCategories)[number]["id"];
export type ProductPhoto = { src: string; name: string };
export type CatalogueProduct = Product & {
  category: CatalogueCategory;
  subcategory: string;
  sourceSlug: string;
  images: ProductPhoto[];
  missing?: string;
};

function fromRecord(slug: string, category: CatalogueCategory, subcategory: string, photoNames: string[] = []): CatalogueProduct {
  const record = products.find((product) => product.slug === slug);
  if (!record) throw new Error(`Missing existing product: ${slug}`);
  const photos = [...gallery, ...showcase].filter((photo) => photoNames.includes(photo.name));
  const images = [{ src: record.image, name: record.name }, ...photos.map((photo) => ({ src: photo.image, name: photo.name }))];
  return { ...record, category, subcategory, sourceSlug: slug, images: images.filter((photo, index) => images.findIndex((item) => item.src === photo.src) === index) };
}

function variant(sourceSlug: string, slug: string, name: string, category: CatalogueCategory, detail: string, summary: string, specifications?: string[]): CatalogueProduct {
  const source = products.find((product) => product.slug === sourceSlug);
  if (!source) throw new Error(`Missing existing product: ${sourceSlug}`);
  // Combined source photography cannot establish which individual variant is pictured.
  return { slug, name, category, subcategory: name, sourceSlug, detail, summary, ...(specifications ? { specifications } : {}), image: "", images: [], missing: "A dedicated product photo is not yet available. Please contact Handlair for product-specific information." };
}

export const catalogueProducts: CatalogueProduct[] = [
  fromRecord("centrifugal-blowers", "air", "Centrifugal Blowers", ["Centrifugal Blower", "High Temperature Blower"]),
  fromRecord("axial-flow-fans", "air", "Axial Flow Fans", ["Axial Fan", "Axial Flow Fan"]),
  fromRecord("roof-extractors", "air", "Roof Extractors", ["Roof Extractor"]),
  fromRecord("industrial-mancoolers", "air", "Man Coolers"),
  fromRecord("air-cooling-units", "air", "Air Cooling Systems", ["Air Cooling System", "Air Cooling Unit 25 K", "Air Cooling Unit", "Air Cooling Unit 5 K", "Air Cooling Unit 6 K", "Air Cooling Unit 50 K"]),
  fromRecord("bag-filter-dust-collectors", "dust", "Bag Type Dust Collectors", ["Bag Filter Dust Collector", "Pulse Jet Bag Filter"]),
  fromRecord("cyclone-dust-collectors", "dust", "Cyclone Dust Collectors", ["Cyclone Dust Collector"]),
  variant("wet-scrubbers", "spray-scrubbers", "Spray Scrubbers", "dust", "Spray scrubbers serve industrial fume and commercial kitchen exhaust.", "Spray-type systems for industrial fume and commercial kitchen exhaust."),
  variant("wet-scrubbers", "venturi-scrubbers", "Venturi Scrubbers", "dust", "Venturi scrubbers are used for coarse dust in coal handling and ceramic industries.", "Venturi systems for coarse dust in coal handling and ceramic industries."),
  variant("filters", "pre-filters", "Pre-Filters", "filters", "HANDLAIR prefilters are washable and available in rod or pleated configurations.", "Washable prefilters in rod or pleated configurations.", ["Prefilter efficiency: greater than 90% down to 10 micron"]),
  { ...variant("filters", "fine-hepa-filters", "Fine Filters & HEPA Filters", "filters", "", ""), missing: "Product-specific descriptions, specifications and photos are not yet available. Please contact Handlair for details." },
  variant("filters", "oil-bath-pre-filters", "Oil Bath Pre-Filters", "filters", "Oil-bath filters are developed for ventilation plants where surrounding-air dust concentration is comparatively heavy.", "Oil-bath filters for ventilation plants with comparatively heavy surrounding-air dust."),
];

export function filterCatalogue(category: CatalogueCategory | "all", subcategory = "all") {
  return catalogueProducts.filter((product) => (category === "all" || product.category === category) && (subcategory === "all" || product.slug === subcategory));
}

export function findCatalogueProduct(slug: string): CatalogueProduct | undefined {
  const item = catalogueProducts.find((product) => product.slug === slug);
  if (item) return item;
  // Keep the existing combined-product URLs intact for older links and the homepage.
  const original = products.find((product) => product.slug === slug);
  if (!original) return undefined;
  return { ...original, category: slug === "filters" ? "filters" : "dust", subcategory: original.name, sourceSlug: slug, images: [{ src: original.image, name: original.name }] };
}

export function categoryName(category: CatalogueCategory) {
  return catalogueCategories.find((item) => item.id === category)?.name ?? "Products";
}