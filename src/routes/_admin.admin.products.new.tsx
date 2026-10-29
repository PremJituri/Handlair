import { adminCatalogueQuery } from "@/lib/admin-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin-head";
import { ProductEditor } from "@/components/admin/product-editor";
export const Route = createFileRoute("/_admin/admin/products/new")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminCatalogueQuery),
  errorComponent: () => <p role="alert">This page could not load. Please try again.</p>,
  notFoundComponent: () => <p>Admin page not found.</p>,
  head: () => adminHead("New product"),
  component: NewProduct,
});
function NewProduct() {
  const { data } = useSuspenseQuery(adminCatalogueQuery);
  return <ProductEditor data={data} />;
}
