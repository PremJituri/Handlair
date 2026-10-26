import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readPublicCatalogue } from "./catalogue.server";
export const getPublicCatalogue = createServerFn({ method: "GET" }).handler(readPublicCatalogue);
export const getPublicProductBySlug = createServerFn({ method: "GET" }).inputValidator(z.object({ slug: z.string().max(120) })).handler(async ({ data }) => {
  const catalogue = await readPublicCatalogue();
  return { product: catalogue.all.find((p) => p.slug === data.slug), related: catalogue.products, categories: catalogue.categories };
});