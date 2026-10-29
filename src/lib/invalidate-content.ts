import type { QueryClient } from "@tanstack/react-query";

export async function invalidateContent(queries: QueryClient, kind: "catalogue" | "hero") {
  const keys =
    kind === "hero"
      ? [["admin", "hero-slides"], ["hero-slides"]]
      : [["admin", "catalogue"], ["public-catalogue"], ["public-product"]];
  // Inactive preloaded entries must refresh too, before ensureQueryData reuses them.
  await Promise.all(
    keys.map((queryKey) => queries.invalidateQueries({ queryKey, refetchType: "all" })),
  );
}