import type { QueryClient } from "@tanstack/react-query";

export async function invalidateContent(
  queries: QueryClient,
  kind: "catalogue" | "hero" | "featured",
) {
  const keys =
    kind === "hero"
      ? [["admin", "hero-slides"], ["hero-slides"]]
      : kind === "featured"
        ? [["admin", "featured-products"], ["featured-products"]]
        : [["admin", "catalogue"], ["public-catalogue"], ["public-product"], ["featured-products"]];
  // Inactive preloaded entries must refresh too, before ensureQueryData reuses them.
  await Promise.all(
    keys.map((queryKey) => queries.invalidateQueries({ queryKey, refetchType: "all" })),
  );
}
