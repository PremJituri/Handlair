import { createFileRoute } from "@tanstack/react-router";
import { getAdminData } from "@/lib/cms.functions";
import { adminHead } from "@/lib/admin-head";
import { ProductEditor } from "@/components/admin/product-editor";
export const Route=createFileRoute("/_admin/admin/products/new")({loader:()=>getAdminData(),head:()=>adminHead("New product"),component:NewProduct});
function NewProduct(){ return <ProductEditor data={Route.useLoaderData()}/>; }