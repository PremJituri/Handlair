import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Package, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/cms-auth.functions";
import type { ReactNode } from "react";
export function AdminShell({children}:{children:ReactNode}){
  const navigate=useNavigate();const router=useRouter();const queries=useQueryClient();
  return <div className="mx-auto site-container px-5 py-12 lg:px-8"><div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><div><p className="eyebrow">Handlair / Administration</p><nav className="mt-4 flex gap-2"><Button asChild variant="outline"><Link to="/admin/products"><Package/> Products</Link></Button><Button asChild variant="outline"><Link to="/admin/categories"><Folder/> Categories</Link></Button></nav></div><Button variant="ghost" onClick={async()=>{await queries.cancelQueries();queries.clear();await logout();await navigate({to:"/admin/login",replace:true});await router.invalidate();}}><LogOut/> Logout</Button></div>{children}</div>;
}