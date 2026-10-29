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
    defaultPendingMs: 300,
    defaultPendingComponent: () => (
      <div
        role="status"
        aria-label="Loading"
        className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-secondary"
      >
        <div className="h-full w-1/3 animate-pulse bg-primary" />
      </div>
    ),
  });

  // Transfer server-loaded query data to the browser so it is not fetched twice.
  setupRouterSsrQueryIntegration({ router, queryClient, wrapQueryClient: false });

  return router;
};
