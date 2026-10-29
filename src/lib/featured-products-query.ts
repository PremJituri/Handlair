import { queryOptions } from "@tanstack/react-query";
import { getAdminFeaturedSlots, getFeaturedProducts } from "./featured-products.functions";

export const featuredProductsQuery = queryOptions({
  queryKey: ["featured-products"],
  queryFn: () => getFeaturedProducts(),
  staleTime: 5 * 60 * 1000,
});

export const adminFeaturedQuery = queryOptions({
  queryKey: ["admin", "featured-products"],
  queryFn: () => getAdminFeaturedSlots(),
  staleTime: 30_000,
});
