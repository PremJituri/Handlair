import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero } from "@/components/site-shell";
import { gallery, galleryCategories, type GalleryCategory } from "@/data/handlair";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Industrial Equipment Gallery — Handlair" },
      { name: "description", content: "View Handlair air cooling units, ducting, fans, blowers, dust collection and fume exhaust installations." },
      { property: "og:title", content: "Handlair Equipment Gallery" },
      { property: "og:description", content: "Air handling equipment and installations in the field." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

type Filter = "All" | GalleryCategory;

function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [index, setIndex] = useState<number | null>(null);
  const items = filter === "All" ? gallery : gallery.filter((g) => g.category === filter);
  const filters: Filter[] = ["All", ...galleryCategories];
  const count = (f: Filter) => (f === "All" ? gallery.length : gallery.filter((g) => g.category === f).length);

  return (
    <>
      <PageHero eyebrow="Project gallery" title="Equipment in the field.">
        <p>A curated collection of Handlair cooling, ducting, fan, dust collection and fume exhaust installations. Select any photo to view it full screen and browse the set.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors",
                filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary hover:bg-secondary",
              )}
            >
              {f}
              <span className={cn("rounded-full px-2 py-0.5 text-xs", filter === f ? "bg-background/25" : "bg-secondary")}>{count(f)}</span>
            </button>
          ))}
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.image}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIndex(i)}
                aria-label={`View ${item.name} in lightbox`}
                className="group flex h-auto w-full flex-col items-stretch gap-0 overflow-hidden rounded-none border border-border bg-background p-0 text-left whitespace-normal transition-shadow hover:bg-background hover:shadow-lg focus-visible:outline-2 focus-visible:outline-primary"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain p-2 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]" />
                </div>
                <div className="glass-surface mx-2 my-2 flex items-center justify-between gap-3 px-3 py-2">
                  <div className="min-w-0">
                    <p className="eyebrow text-primary">{item.category}</p>
                    <h3 className="mt-1 text-base font-bold uppercase leading-tight">{item.name}</h3>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 text-foreground" title="View in lightbox"><Maximize2 className="size-4" /><span className="sr-only">View in lightbox</span></span>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </section>
      {index !== null && <Lightbox items={items} index={index} setIndex={setIndex} />}
      <CtaBand />
    </>
  );
}

function Lightbox({ items, index, setIndex }: { items: typeof gallery; index: number; setIndex: (i: number | null) => void }) {
  const close = useCallback(() => setIndex(null), [setIndex]);
  const prev = useCallback(() => setIndex((index - 1 + items.length) % items.length), [index, items.length, setIndex]);
  const next = useCallback(() => setIndex((index + 1) % items.length), [index, items.length, setIndex]);
  const touchX = useRef<number | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const item = items[index] ?? items[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [close, prev, next]);

  useEffect(() => {
    thumbRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-foreground/95 text-background" role="dialog" aria-modal="true" aria-label={`${item.name}, image ${index + 1} of ${items.length}`} onClick={close}>
      <div className="flex items-center justify-between gap-4 p-4 md:p-5" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-bold" aria-live="polite">Image {index + 1} of {items.length}</p>
        <Button size="icon" variant="secondary" onClick={close} aria-label="Close lightbox"><X /></Button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20"
        onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          const end = e.changedTouches[0]?.clientX;
          if (touchX.current === null || end === undefined) return;
          const dx = end - touchX.current;
          if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
          touchX.current = null;
        }}
      >
        <figure className="flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
          <img src={item.image} alt={item.name} className="max-h-[62vh] max-w-full object-contain" />
          <figcaption className="mt-4 text-center">
            <span className="eyebrow text-accent">{item.category}</span>
            <span className="mt-1 block text-xl font-bold uppercase">{item.name}</span>
          </figcaption>
        </figure>
        <Button size="icon" variant="secondary" className="absolute left-2 top-1/2 size-11 -translate-y-1/2 md:left-5" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image"><ChevronLeft /></Button>
        <Button size="icon" variant="secondary" className="absolute right-2 top-1/2 size-11 -translate-y-1/2 md:right-5" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image"><ChevronRight /></Button>
      </div>
      <div ref={thumbRef} className="flex gap-2 overflow-x-auto p-4 md:justify-center" onClick={(e) => e.stopPropagation()}>
        {items.map((t, i) => (
          <button key={t.image} data-i={i} type="button" onClick={() => setIndex(i)} aria-label={`Show ${t.name}`} aria-current={i === index}
            className={cn("h-14 w-20 shrink-0 overflow-hidden border-2 transition-opacity", i === index ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-90")}>
            <img src={t.image} alt="" className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
