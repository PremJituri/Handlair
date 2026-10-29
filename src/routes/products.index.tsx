import { createFileRoute } from "@tanstack/react-router";
import { pageSeo, breadcrumbLd } from "@/lib/seo";
import { ProductCatalogue } from "@/components/products/catalogue";
import { CtaBand, PageHero } from "@/components/site-shell";
import { getPublicCatalogue } from "@/lib/catalogue.functions";

export const Route = createFileRoute("/products/")({
  loader: () => getPublicCatalogue(),
  head: () => ({
    ...pageSeo(
      "/products",
      "Industrial Air Handling Equipment & Systems Catalogue — Handlair",
      "Browse Handlair's complete range of centrifugal blowers, axial fans, air cooling units, bag filters, cyclone collectors, and industrial scrubbers.",
    ),
    scripts: [
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
      ]),
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const data = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow="Product catalogue" title="Industrial air handling products.">
        <p>Equipment for air cooling, ventilation, dust collection and filtration.</p>
      </PageHero>
      <ProductCatalogue products={data.products} categories={data.categories} />
      <CtaBand />
    </>
  );
}
