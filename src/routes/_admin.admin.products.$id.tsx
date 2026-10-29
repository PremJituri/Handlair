import { adminCatalogueQuery } from "@/lib/admin-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin-head";
import { ProductEditor } from "@/components/admin/product-editor";
export const Route = createFileRoute("/_admin/admin/products/$id")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminCatalogueQuery),
  errorComponent: ({ error }) => <p role="alert">{error.message}</p>,
  notFoundComponent: () => <p>Admin page not found.</p>,
  head: () => adminHead("Edit product"),
  component: EditProduct,
});
function EditProduct() {
  const { data } = useSuspenseQuery(adminCatalogueQuery);
  const { id } = Route.useParams();
  return <ProductEditor key={id} id={id} data={data} />;
}
