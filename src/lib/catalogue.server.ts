import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  catalogueCategories,
  catalogueProducts,
  findCatalogueProduct,
  type CatalogueProduct,
} from "@/data/product-catalogue";
import { z } from "zod";

/**
 * Reads the public catalogue. With `slug`, only that product's category (the
 * product plus its related products) and their photos are read.
 */
export async function readPublicCatalogue(slug?: string) {
  try {
    const key = process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];
    const url = process.env["SUPABASE_URL"];
    if (!key || !url) throw new Error("Catalogue connection unavailable");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    let p;
    let i;
    const c = await client.from("categories").select("*").order("display_order");
    if (slug) {
      const target = await client.from("products").select("category_id").eq("slug", slug).limit(1);
      if (target.error) throw new Error("Catalogue read unavailable");
      const categoryId = target.data?.[0]?.category_id;
      if (!categoryId) {
        return {
          categories: (c.data ?? []).map((row) => ({ id: row.slug, name: row.name })),
          products: [],
          all: [],
          fallback: false,
        };
      }
      p = await client
        .from("products")
        .select("*")
        .eq("category_id", categoryId)
        .order("display_order");
      const ids = (p.data ?? []).map((row) => row.id);
      i = await client
        .from("product_images")
        .select("*")
        .in("product_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"])
        .order("display_order");
    } else {
      [p, i] = await Promise.all([
        client.from("products").select("*").order("display_order"),
        client.from("product_images").select("*").order("display_order"),
      ]);
    }
    if (p.error || c.error || i.error) throw new Error("Catalogue read unavailable");
    const items = (p.data ?? []).map((row) => {
      const category = c.data?.find((cat) => cat.id === row.category_id);
      const photoUrl = (image: { filename: string; image_url: string }) =>
        image.filename ? `/api/public/product-photo/${image.filename}` : image.image_url;
      const photos = featuredFirst(
        (i.data ?? []).filter((image) => image.product_id === row.id),
        row.thumbnail_url,
        (image) => image.image_url,
      );
      const sections = z
        .array(
          z.object({
            title: z.string(),
            body: z.array(z.string()),
            list: z.array(z.string()).optional(),
          }),
        )
        .safeParse(row.sections_json);
      const body = z.array(z.string()).safeParse(row.body_json);
      const specs = z.array(z.string()).safeParse(row.specs_json);
      return {
        slug: row.slug,
        name: row.name,
        summary: row.summary,
        detail: row.detail,
        specifications: specs.success ? specs.data : [],
        image: row.thumbnail_url,
        category: category?.slug ?? "dust",
        subcategory: row.subcategory || row.name,
        sourceSlug: row.source_slug || row.slug,
        missing: row.missing ?? undefined,
        images: photos.map((image) => ({ src: photoUrl(image), name: image.alt_text || row.name })),
        sections: sections.success ? sections.data : [],
        body: body.success ? body.data : [],
        visible: row.catalogue_visible,
      };
    });
    return {
      categories: (c.data ?? []).map((row) => ({ id: row.slug, name: row.name })),
      products: items.filter((p) => p.visible),
      all: items,
      fallback: false,
    };
  } catch {
    const all = [
      ...catalogueProducts,
      ...["wet-scrubbers", "filters"].flatMap((slug) => {
        const p = findCatalogueProduct(slug);
        return p ? [p] : [];
      }),
    ];
    const expand = (p: CatalogueProduct) => ({
      ...p,
      body: [] as string[],
      sections: [] as { title: string; body: string[]; list?: string[] }[],
      visible: catalogueProducts.some((item) => item.slug === p.slug),
    });
    return {
      categories: [...catalogueCategories],
      products: catalogueProducts.map(expand),
      all: all.map(expand),
      fallback: true,
    };
  }
}
