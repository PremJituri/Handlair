import { queryOptions } from "@tanstack/react-query";
import { getHeroSlides } from "./cms.functions";

export const heroSlidesQuery = queryOptions({
  queryKey: ["hero-slides"],
  queryFn: () => getHeroSlides(),
  // Admin edits invalidate this key explicitly; visitors reuse it for 5 minutes.
  staleTime: 5 * 60 * 1000,
});
