import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { verifyAuth } from "@/lib/cms-auth.functions";
import { AdminShell } from "@/components/admin/admin-shell";
export const Route=createFileRoute("/_admin")({beforeLoad:async()=>{const admin=await verifyAuth();if(!admin)throw redirect({to:"/admin/login"});return {admin};},component:()=> <AdminShell><Outlet/></AdminShell>});