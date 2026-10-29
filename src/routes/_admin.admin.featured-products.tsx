import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminCatalogueQuery } from "@/lib/admin-query";
import { adminFeaturedQuery } from "@/lib/featured-products-query";
import { saveFeaturedProducts } from "@/lib/featured-products.functions";
import { invalidateContent } from "@/lib/invalidate-content";
import { adminHead } from "@/lib/admin-head";

const SLOTS = [1, 2, 3, 4, 5, 6] as const;

export const Route = createFileRoute("/_admin/admin/featured-products")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminFeaturedQuery),
      context.queryClient.ensureQueryData(adminCatalogueQuery),
    ]),
  errorComponent: () => <p role="alert">This page could not load. Please try again.</p>,
  notFoundComponent: () => <p>Admin page not found.</p>,
  head: () => adminHead("Featured Range"),
  component: FeaturedRange,
});

function FeaturedRange() {
  const { data: saved } = useSuspenseQuery(adminFeaturedQuery);
  const { data: catalogue } = useSuspenseQuery(adminCatalogueQuery);
  const queries = useQueryClient();
  const save = useServerFn(saveFeaturedProducts);
  const published = catalogue.products.filter((p) => p.is_published);
  const initial = () =>
    Object.fromEntries(
      SLOTS.map((n) => [n, saved.find((s) => s.slot_number === n)?.product_id ?? ""]),
    ) as Record<number, string>;
  const [slots, setSlots] = useState<Record<number, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = SLOTS.some(
    (n) => slots[n] !== (saved.find((s) => s.slot_number === n)?.product_id ?? ""),
  );

  const thumb = (productId: string) => {
    const p = catalogue.products.find((x) => x.id === productId);
    if (!p) return "";
    if (p.thumbnail_url) return p.thumbnail_url;
    const img = catalogue.images.find((i) => i.product_id === p.id);
    return img ? (img.filename ? `/api/public/product-photo/${img.filename}` : img.image_url) : "";
  };

  async function submit() {
    setError("");
    setMessage("");
    if (SLOTS.some((n) => !slots[n])) {
      setError("Choose a product for all 6 slots before saving.");
      return;
    }
    setBusy(true);
    try {
      await save({ data: SLOTS.map((n) => ({ slot_number: n, product_id: slots[n]! })) });
      await invalidateContent(queries, "featured");
      setMessage("Featured range saved. The homepage now shows these products.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Featured range could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-h2">Featured Range</h1>
          <p className="mt-2 type-body">
            Choose the 6 products shown in “02 / Product range” on the homepage.
          </p>
        </div>
        <Button onClick={submit} disabled={busy || !dirty}>
          <Save /> {busy ? "Saving…" : "Save Featured Range"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mb-6 rounded-lg border border-destructive p-3 text-destructive">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mb-6 rounded-lg border border-primary bg-secondary p-3">
          {message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SLOTS.map((n) => {
          const current = catalogue.products.find((p) => p.id === slots[n]);
          const src = slots[n] ? thumb(slots[n]) : "";
          return (
            <div key={n} className="rounded-lg border border-border bg-background p-4">
              <p className="eyebrow">Slot {String(n).padStart(2, "0")}</p>
              <div className="mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-muted/40">
                {src ? (
                  <img src={src} alt={current?.name ?? ""} className="h-full w-full object-contain p-3" />
                ) : (
                  <span className="text-sm text-muted-foreground">No photo</span>
                )}
              </div>
              <p className="mt-3 font-bold">{current?.name ?? "Not assigned"}</p>
              {current && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{current.summary}</p>
              )}
              <label className="mt-3 block text-sm font-bold" htmlFor={`slot-${n}`}>
                Product
              </label>
              <select
                id={`slot-${n}`}
                value={slots[n]}
                onChange={(e) => setSlots((s) => ({ ...s, [n]: e.target.value }))}
                className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a product…</option>
                {published.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </section>
  );
}
