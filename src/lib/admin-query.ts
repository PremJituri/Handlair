import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { getAdminData, getAdminHeroSlides } from "./cms.functions";
import { getEnquiries } from "./enquiry.functions";

export const adminCatalogueQuery = queryOptions({
  queryKey: ["admin", "catalogue"],
  queryFn: () => getAdminData(),
  staleTime: 30_000,
});

export const adminHeroQuery = queryOptions({
  queryKey: ["admin", "hero-slides"],
  queryFn: () => getAdminHeroSlides(),
  staleTime: 30_000,
});

export const adminEnquiriesQuery = (page: number) =>
  queryOptions({
    queryKey: ["admin", "enquiries", page],
    queryFn: () => getEnquiries({ data: { page } }),
    staleTime: 30_000,
  });

// Start the protected read alongside the route guard, not after it. Every read
// still verifies its own encrypted session before returning any private data.
export function preloadAdminPage(queries: QueryClient, href: string) {
  const url = new URL(href, "https://handlair.local");
  if (url.pathname.startsWith("/admin/hero-slides"))
    return queries.prefetchQuery(adminHeroQuery);
  if (url.pathname.startsWith("/admin/enquiries")) {
    const page = Number(url.searchParams.get("page"));
    return queries.prefetchQuery(adminEnquiriesQuery(Number.isInteger(page) && page > 0 ? page : 1));
  }
  return queries.prefetchQuery(adminCatalogueQuery);
}