import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 250,
    defaultPendingComponent: () => (
      <div
        role="status"
        aria-label="Loading"
        className="mx-auto w-full site-container px-5 pb-20 pt-[calc(2rem+var(--header-slot))] lg:px-8"
      >
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="mt-4 h-10 w-72 rounded bg-muted md:w-96" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-48 rounded-lg bg-muted/60" />
            <div className="h-48 rounded-lg bg-muted/60" />
            <div className="h-48 rounded-lg bg-muted/60" />
          </div>
        </div>
      </div>
    ),
  });

  // Transfer server-loaded query data to the browser so it is not fetched twice.
  setupRouterSsrQueryIntegration({ router, queryClient, wrapQueryClient: false });

  return router;
};
