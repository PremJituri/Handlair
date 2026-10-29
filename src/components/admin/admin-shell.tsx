import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Package, Folder, Images, Inbox, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/cms-auth.functions";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
const tabs = [
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Folder },
  { to: "/admin/featured-products", label: "Featured Range", icon: LayoutGrid },
  { to: "/admin/hero-slides", label: "Hero Photos", icon: Images },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
] as const;
export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const router = useRouter();
  const queries = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto w-full site-container px-5 py-12 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="eyebrow">Handlair / Administration</p>
          <nav className="mt-4 flex flex-wrap gap-2">
            {tabs.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <Button
                  key={to}
                  asChild
                  variant="ghost"
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "h-10 rounded-full border px-4",
                    active
                      ? "border-primary bg-primary font-bold text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      : "border-border bg-background hover:border-primary/60 hover:bg-secondary",
                  )}
                >
                  <Link to={to}>
                    <Icon /> {label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={async () => {
            await queries.cancelQueries();
            queries.clear();
            await logout();
            await navigate({ to: "/admin/login", replace: true });
            await router.invalidate();
          }}
        >
          <LogOut /> Logout
        </Button>
      </div>
      {children}
    </div>
  );
}
