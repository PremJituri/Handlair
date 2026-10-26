import { createFileRoute } from "@tanstack/react-router";
import { ProductCatalogue } from "@/components/products/catalogue";
import { CtaBand, PageHero } from "@/components/site-shell";
import { getPublicCatalogue } from "@/lib/catalogue.functions";

export const Route = createFileRoute("/products/")({ loader: () => getPublicCatalogue(), head: () => ({ meta: [
  { title: "Industrial Air Handling Products — Handlair" }, { name: "description", content: "Explore Handlair centrifugal blowers, axial fans, air cooling units, dust collectors, scrubbers, filters and extractors." }, { property: "og:title", content: "Handlair Product Range" }, { property: "og:description", content: "Industrial air handling and pollution control equipment." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: ProductsPage });

function ProductsPage() { const data = Route.useLoaderData(); return <><PageHero eyebrow="Product catalogue" title="Industrial air handling products."><p>Equipment for air cooling, ventilation, dust collection and filtration.</p></PageHero><ProductCatalogue products={data.products} categories={data.categories} /><CtaBand /></> }