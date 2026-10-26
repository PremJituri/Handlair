import { queryOptions } from "@tanstack/react-query";
import { getHeroSlides } from "./cms.functions";

export const heroSlidesQuery = queryOptions({
  queryKey: ["hero-slides"],
  queryFn: () => getHeroSlides(),
  staleTime: 0,
});