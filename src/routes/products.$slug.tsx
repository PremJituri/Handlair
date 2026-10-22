import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site-shell";
import { ProductGallery } from "@/components/products/product-gallery";
import { catalogueProducts, categoryName, findCatalogueProduct } from "@/data/product-catalogue";
import { emphasize } from "@/lib/emphasize";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => { const product = findCatalogueProduct(params.slug); if (!product) throw notFound(); return product; },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.name} — Handlair` : "Unavailable product — Handlair" },
    { name: "description", content: loaderData?.summary || "Handlair industrial air handling equipment. Contact us for product information." },
    { property: "og:title", content: loaderData ? `${loaderData.name} — Handlair` : "Handlair product" },
    { property: "og:description", content: loaderData?.summary || "Industrial air handling equipment and product enquiries." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const related = catalogueProducts.filter((item) => item.category === product.category && item.slug !== product.slug);
  return <><section className="pattern-grid -mt-[var(--header-slot)] border-b border-border"><div className="mx-auto max-w-7xl px-5 pb-14 pt-[calc(3rem+var(--header-slot))] lg:px-8 lg:pb-20">
    <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-base font-bold text-foreground hover:text-primary"><ArrowLeft className="size-4" /> Full product catalogue</Link>
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14"><div><p className="eyebrow">{categoryName(product.category)}</p><h1 className="mt-5 type-page [overflow-wrap:anywhere]">{product.name}</h1>{product.summary && <p className="mt-6 type-lead">{product.summary}</p>}<Button asChild size="xl" className="mt-8 max-w-full whitespace-normal"><Link to="/enquiry">Enquire about this product <ArrowRight /></Link></Button></div><ProductGallery key={product.slug} name={product.name} images={product.images} /></div>
  </div></section>
  <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8"><div><h2 className="type-h3">Product overview</h2><p className="mt-5 type-body">{product.detail ? emphasize(product.detail) : "A product-specific description is not yet available."}</p>{product.missing && <p className="mt-6 border-l-2 border-primary pl-4 type-body">{product.missing}</p>}</div><div><h2 className="type-h3">Technical specifications</h2>{product.specifications?.length ? <ul className="mt-5 divide-y divide-border border-y border-border">{product.specifications.map((spec) => <li key={spec} className="py-4 type-body">{spec.includes(":") ? <>{spec.split(":")[0]}: <strong>{spec.split(":").slice(1).join(":").trim()}</strong></> : <strong>{spec}</strong>}</li>)}</ul> : <p className="mt-5 type-body">Detailed specifications are not yet available. Contact Handlair to discuss your requirements.</p>}</div></section>
  {related.length > 0 && <section className="border-t border-border"><div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><h2 className="type-h3">More in {categoryName(product.category)}</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{related.map((item) => <Button key={item.slug} asChild variant="outline" className="h-auto min-h-14 justify-between whitespace-normal py-3 text-left text-base"><Link to="/products/$slug" params={{ slug: item.slug }}>{item.name}<ArrowRight /></Link></Button>)}</div></div></section>}
  <CtaBand /></>;
}