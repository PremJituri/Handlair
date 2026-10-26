import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { catalogueCategories, catalogueProducts, findCatalogueProduct, type CatalogueProduct } from "@/data/product-catalogue";
import { z } from "zod";

export async function readPublicCatalogue() {
  try {
    const key = process.env['SUPABASE_ANON_KEY'] ?? process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) throw new Error("Catalogue connection unavailable");
    const client = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
      const h = new Headers(init?.headers); if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h });
    } } });
    const [p,c,i] = await Promise.all([client.from("products").select("*").order("display_order"), client.from("categories").select("*").order("display_order"), client.from("product_images").select("*").order("display_order")]);
    if (p.error || c.error || i.error) throw new Error("Catalogue read unavailable");
    const items = (p.data ?? []).map((row) => {
      const category = c.data?.find((cat) => cat.id === row.category_id);
      const photoUrl = (image: { filename: string; image_url: string }) => image.filename ? `/api/public/product-photo/${image.filename}` : image.image_url;
      const photos = (i.data ?? []).filter((image) => image.product_id === row.id);
      const sections = z.array(z.object({ title: z.string(), body: z.array(z.string()), list: z.array(z.string()).optional() })).safeParse(row.sections_json);
      const body = z.array(z.string()).safeParse(row.body_json);
      const specs = z.array(z.string()).safeParse(row.specs_json);
      return { slug: row.slug, name: row.name, summary: row.summary, detail: row.detail, specifications: specs.success ? specs.data : [], image: row.thumbnail_url, category: category?.slug ?? "dust", subcategory: row.subcategory || row.name, sourceSlug: row.source_slug || row.slug, missing: row.missing ?? undefined, images: photos.map((image) => ({ src: photoUrl(image), name: image.alt_text || row.name })), sections: sections.success ? sections.data : [], body: body.success ? body.data : [], visible: row.catalogue_visible };
    });
    return { categories: (c.data ?? []).map((row) => ({ id: row.slug, name: row.name })), products: items.filter((p) => p.visible), all: items, fallback: false };
  } catch {
    const all = [...catalogueProducts, ...["wet-scrubbers", "filters"].flatMap((slug) => { const p = findCatalogueProduct(slug); return p ? [p] : []; })];
    const expand = (p: CatalogueProduct) => ({ ...p, body: [] as string[], sections: [] as { title: string; body: string[]; list?: string[] }[], visible: catalogueProducts.some((item) => item.slug === p.slug) });
    return { categories: [...catalogueCategories], products: catalogueProducts.map(expand), all: all.map(expand), fallback: true };
  }
});}
