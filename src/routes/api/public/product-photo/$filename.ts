import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
export const Route = createFileRoute("/api/public/product-photo/$filename")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!/^[a-f0-9-]{36}\.jpg$/.test(params.filename))
          return new Response("Not found", { status: 404 });
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_ANON_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return new Response("Unavailable", { status: 503 });
        const db = createClient<Database>(url, key, {
          auth: { persistSession: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_")) h.delete("Authorization");
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });
        const { data: rows } = await db
          .from("product_images")
          .select("id,products!inner(is_published)")
          .eq("filename", params.filename)
          .eq("products.is_published", true)
          .limit(1);
        let data: Blob | null = null;
        if (rows?.length) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          data = (await supabaseAdmin.storage.from("product-images").download(params.filename))
            .data;
        }
        if (!data) {
          try {
            const { requireAdmin } = await import("@/lib/cms-auth.server");
            await requireAdmin();
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const photo = await supabaseAdmin.storage
              .from("product-images")
              .download(params.filename);
            if (photo.data)
              return new Response(photo.data, {
                headers: {
                  "Content-Type": "image/jpeg",
                  "Cache-Control": "private, no-store",
                  "X-Content-Type-Options": "nosniff",
                },
              });
          } catch {
            /* Only an authenticated administrator can read draft photos. */
          }
          return new Response("Not found", { status: 404 });
        }
        return new Response(data, {
          headers: {
            "Content-Type": "image/jpeg",
            // Short public cache: unpublished or removed photos stop serving within 5 minutes.
            "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
