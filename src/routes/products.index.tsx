import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pageSeo, breadcrumbLd } from "@/lib/seo";
import { ProductCatalogue } from "@/components/products/catalogue";
import { CtaBand, PageHero } from "@/components/site-shell";
import { publicCatalogueQuery } from "@/lib/catalogue-query";

export const Route = createFileRoute("/products/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicCatalogueQuery),
  errorComponent: ({ error }) => <p role="alert">{error.message}</p>,
  notFoundComponent: () => <p>Catalogue not found.</p>,
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
  const { data } = useSuspenseQuery(publicCatalogueQuery);
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
