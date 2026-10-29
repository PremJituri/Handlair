import { createFileRoute } from "@tanstack/react-router";
import { getAdminData } from "@/lib/cms.functions";
import { adminHead } from "@/lib/admin-head";
import { ProductEditor } from "@/components/admin/product-editor";
export const Route = createFileRoute("/_admin/admin/products/$id")({
  loader: () => getAdminData(),
  head: () => adminHead("Edit product"),
  component: EditProduct,
});
function EditProduct() {
  const { id } = Route.useParams();
  return <ProductEditor key={id} id={id} data={Route.useLoaderData()} />;
}
