import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/catalogue.functions", () => ({ getPublicCatalogue: vi.fn(), getPublicProductBySlug: vi.fn() }));
vi.mock("@/lib/cms.functions", () => ({ getAdminData: vi.fn(), saveProduct: vi.fn(), saveCategory: vi.fn(), deleteCategory: vi.fn(), deleteProduct: vi.fn(), uploadImage: vi.fn(), deleteImage: vi.fn() }));
vi.mock("@/lib/cms-auth.functions", () => ({ login: vi.fn(), verifyAuth: vi.fn(), logout: vi.fn() }));

import { routeTree } from "@/routeTree.gen";
import { catalogueProducts } from "@/data/product-catalogue";
import { products } from "@/data/handlair";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("preserves all remaining public and legacy product routes", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const path of [
      "/",
      "/about",
      "/products",
      "/contact",
      "/enquiry",
      ...[...products, ...catalogueProducts].map((product) => `/products/${product.slug}`),
    ]) {
      expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
    }
  });
  it("no longer registers the standalone Gallery route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/gallery").at(-1)?.routeId).toBe(rootRouteId);
  });
});
