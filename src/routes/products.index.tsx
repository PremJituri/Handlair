import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/product-grid";
import { CtaBand, PageHero } from "@/components/site-shell";
import { systems } from "@/data/handlair";

export const Route = createFileRoute("/products/")({ head: () => ({ meta: [
  { title: "Industrial Air Handling Products — Handlair" }, { name: "description", content: "Explore Handlair centrifugal blowers, axial fans, air cooling units, dust collectors, scrubbers, filters and extractors." }, { property: "og:title", content: "Handlair Product Range" }, { property: "og:description", content: "Industrial air handling and pollution control equipment." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: ProductsPage });

function ProductsPage() { return <><PageHero eyebrow="Product catalogue" title="Equipment for every part of the airflow."><p>Engineered products for cooling, ventilation, filtration, dust collection and fume exhaust applications.</p></PageHero><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><ProductGrid /></section><section className="border-y border-border bg-foreground text-background"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8"><div><p className="eyebrow">Integrated systems</p><h2 className="mt-5 type-h2">Products selected as a complete system.</h2></div><div className="grid gap-px bg-background/20 sm:grid-cols-2">{systems.map((system, i) => <div key={system} className="bg-foreground p-5 last:sm:col-span-2"><span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-2 type-h3">{system}</h3></div>)}</div></div></section><CtaBand /></> }