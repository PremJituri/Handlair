import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/enquiry", changefreq: "monthly", priority: "0.8" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { readPublicCatalogue } = await import("@/lib/catalogue.server");
        const catalogue = await readPublicCatalogue();
        const products = catalogue.products.map((p) => ({ path: `/products/${encodeURIComponent(p.slug)}`, changefreq: "monthly", priority: "0.8" }));
        const urls = [...staticPages, ...products]
          .map((e) => `<url><loc>${SITE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`)
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
