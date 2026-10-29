import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { verifyAuth } from "@/lib/cms-auth.functions";
import { AdminShell } from "@/components/admin/admin-shell";
import { preloadAdminPage } from "@/lib/admin-query";
export const Route = createFileRoute("/_admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  beforeLoad: async ({ context, location }) => {
    const [admin] = await Promise.all([
      verifyAuth(),
      preloadAdminPage(context.queryClient, location.href),
    ]);
    if (!admin) {
      await context.queryClient.cancelQueries({ queryKey: ["admin"] });
      context.queryClient.removeQueries({ queryKey: ["admin"] });
      throw redirect({ to: "/admin/login" });
    }
    return { admin };
  },
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
