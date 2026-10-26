import { createFileRoute } from "@tanstack/react-router";
import { getAdminData } from "@/lib/cms.functions";
import { adminHead } from "@/lib/admin-head";
import { ProductEditor } from "@/components/admin/product-editor";
export const Route=createFileRoute("/_admin/admin/products/$id")({loader:()=>getAdminData(),head:()=>adminHead("Edit product"),component:()=> <ProductEditor key={Route.useParams().id} id={Route.useParams().id} data={Route.useLoaderData()}/>});