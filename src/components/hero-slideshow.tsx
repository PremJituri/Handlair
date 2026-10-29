import { useEffect, useState } from "react";
import { HERO_SLIDE_CROSSFADE_MS, HERO_SLIDE_INTERVAL_MS, heroSlides } from "@/data/hero-slideshow";
import type { HeroPhoto } from "@/lib/hero-slides";
import { optimizedPhotoUrl } from "@/data/image-renditions";

export function HeroSlideshow({ slides = heroSlides }: { slides?: readonly HeroPhoto[] }) {
  const photos = slides.length ? slides : heroSlides;
  return <SlideshowPlayback key={photos.map((photo) => photo.src).join("|")} slides={photos} />;
}

function SlideshowPlayback({ slides }: { slides: readonly HeroPhoto[] }) {
  const [active, setActive] = useState(0);
  // Number of leading slides that are decoded and rendered. Further slides are
  // fetched one at a time, just ahead of when they are needed.
  const [loaded, setLoaded] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decoded = new Set<number>([0]);
    const decode = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.src = optimizedPhotoUrl(slides[index]!.src);
        image
          .decode()
          .catch(() => undefined)
          .then(() => {
            decoded.add(index);
            if (!cancelled) setLoaded((n) => Math.max(n, index + 1));
            resolve();
          });
      });
    let current = 0;
    const schedule = () => {
      clearTimeout(timer);
      timer = undefined;
      if (cancelled || motion.matches || slides.length <= 1) return;
      const next = (current + 1) % slides.length;
      // Fetch the upcoming slide during the dwell time of the current one.
      const ready = decoded.has(next) ? Promise.resolve() : decode(next);
      const started = Date.now();
      void ready.then(() => {
        if (cancelled || motion.matches) return;
        const wait = Math.max(0, HERO_SLIDE_INTERVAL_MS - (Date.now() - started));
        timer = setTimeout(() => {
          current = next;
          setActive(next);
          schedule();
        }, wait);
      });
    };
    void decode(0).then(schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      motion.removeEventListener("change", schedule);
    };
  }, [slides]);

  return (
    <div className="relative aspect-[4/5] w-full">
      {slides.slice(0, loaded).map((slide, index) => (
        <img
          key={`${slide.src}-${index}`}
          src={optimizedPhotoUrl(slide.src)}
          alt={slide.alt}
          aria-hidden={index !== active}
          width={1024}
          height={1280}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          // The outgoing photo stays fully opaque underneath until the incoming one
          // has dissolved in over it, so no frame ever shows the glass behind.
          style={{
            transitionDuration: `${HERO_SLIDE_CROSSFADE_MS}ms`,
            transitionDelay: index === active ? "0ms" : `${HERO_SLIDE_CROSSFADE_MS}ms`,
          }}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${index === active ? "z-10 opacity-100" : "z-0 opacity-0"}`}
        />
      ))}
    </div>
  );
}
