import { queryOptions } from "@tanstack/react-query";
import { getPublicCatalogue, getPublicProductBySlug } from "./catalogue.functions";

export const catalogueStaleTime = 5 * 60 * 1000;

export const publicCatalogueQuery = queryOptions({
  queryKey: ["public-catalogue"],
  queryFn: () => getPublicCatalogue(),
  staleTime: catalogueStaleTime,
});

export const publicProductQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public-product", slug],
    queryFn: () => getPublicProductBySlug({ data: { slug } }),
    staleTime: catalogueStaleTime,
  });
