import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin-head";
export const Route=createFileRoute("/_admin/admin/")({beforeLoad:()=>{throw redirect({to:"/admin/products"});},head:()=>adminHead("Dashboard")});