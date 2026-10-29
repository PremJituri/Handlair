import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/hero-photo/$filename")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!/^[a-f0-9-]{36}\.jpg$/.test(params.filename))
          return new Response("Not found", { status: 404 });
        try {
          const { heroPublicClient } = await import("@/lib/hero-slides.server");
          const db = await heroPublicClient();
          const { data: slide, error: readError } = await db
            .from("hero_slides")
            .select("id")
            .eq("image_url", `/api/public/hero-photo/${params.filename}`)
            .limit(1);
          if (readError || !slide?.length) return new Response("Not found", { status: 404 });
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage
            .from("product-images")
            .download(params.filename);
          if (error || !data) return new Response("Not found", { status: 404 });
          return new Response(data, {
            headers: {
              "Content-Type": "image/jpeg",
              // Short public cache: unpublished or removed photos stop serving within 5 minutes.
              "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch {
          return new Response("Unavailable", { status: 503 });
        }
      },
    },
  },
});
