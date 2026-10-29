import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock("@/lib/catalogue.functions", () => ({
  getPublicCatalogue: vi.fn(async () => ({ products: [], categories: [] })),
  getPublicProductBySlug: vi.fn(async ({ data }: { data: { slug: string } }) => ({
    product: { slug: data.slug },
    related: [],
    categories: [],
  })),
}));
import { publicCatalogueQuery, publicProductQuery } from "@/lib/catalogue-query";
import { getPublicCatalogue, getPublicProductBySlug } from "@/lib/catalogue.functions";
import { invalidateContent } from "@/lib/invalidate-content";
import { requestVerification } from "@/lib/request-verification";

afterEach(() => vi.clearAllMocks());

describe("Navigation caches", () => {
  it("keeps the public catalogue fresh for exactly five minutes and reuses hover preloads", async () => {
    const client = new QueryClient();
    expect(publicCatalogueQuery.staleTime).toBe(300_000);
    await client.prefetchQuery(publicCatalogueQuery);
    await client.ensureQueryData(publicCatalogueQuery);
    expect(getPublicCatalogue).toHaveBeenCalledTimes(1);
    client.clear();
  });
  it("keeps individual slug pages fresh for five minutes without mixing products", async () => {
    const client = new QueryClient();
    expect(publicProductQuery("blower").staleTime).toBe(300_000);
    await client.prefetchQuery(publicProductQuery("blower"));
    await client.ensureQueryData(publicProductQuery("blower"));
    const other = await client.ensureQueryData(publicProductQuery("filter"));
    expect(other.product?.slug).toBe("filter");
    expect(getPublicProductBySlug).toHaveBeenCalledTimes(2);
    client.clear();
  });
  it("refreshes inactive catalogue and product preloads immediately after edits", async () => {
    const client = new QueryClient();
    await client.prefetchQuery(publicCatalogueQuery);
    await client.prefetchQuery(publicProductQuery("blower"));
    await invalidateContent(client, "catalogue");
    expect(getPublicCatalogue).toHaveBeenCalledTimes(2);
    expect(getPublicProductBySlug).toHaveBeenCalledTimes(2);
    client.clear();
  });
  it("invalidates hero caches without touching catalogue data", async () => {
    const client = new QueryClient();
    const read = vi.fn(async () => ["slide"]);
    await client.prefetchQuery({ queryKey: ["hero-slides"], queryFn: read, staleTime: 300_000 });
    await client.prefetchQuery(publicCatalogueQuery);
    await invalidateContent(client, "hero");
    expect(read).toHaveBeenCalledTimes(2);
    expect(getPublicCatalogue).toHaveBeenCalledTimes(1);
    client.clear();
  });
  it("deduplicates verification within one request but revalidates separate requests", async () => {
    const verify = vi.fn(async () => ({ id: "admin" }));
    const cached = requestVerification(verify);
    const request = new Request("https://handlair.local/admin");
    await Promise.all([cached(request), cached(request)]);
    expect(verify).toHaveBeenCalledTimes(1);
    await cached(new Request(request));
    expect(verify).toHaveBeenCalledTimes(2);
  });
});
