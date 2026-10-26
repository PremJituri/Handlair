import { useEffect, useState } from "react";
import { HERO_SLIDE_CROSSFADE_MS, HERO_SLIDE_INTERVAL_MS, heroSlides } from "@/data/hero-slideshow";
import type { HeroPhoto } from "@/lib/hero-slides";

export function HeroSlideshow({ slides = heroSlides }: { slides?: readonly HeroPhoto[] }) {
  const photos = slides.length ? slides : heroSlides;
  return <SlideshowPlayback key={photos.map(photo => photo.src).join("|")} slides={photos} />;
}

function SlideshowPlayback({ slides }: { slides: readonly HeroPhoto[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const images = slides.map((slide) => {
      const image = new Image();
      image.src = slide.src;
      return image;
    });
    let ready = false;
    const updatePlayback = () => {
      clearInterval(timer);
      timer = undefined;
      if (cancelled || !ready || motion.matches || slides.length <= 1) return;
      timer = setInterval(() => {
        setActive((current) => (current + 1) % slides.length);
      }, HERO_SLIDE_INTERVAL_MS);
    };
    // Decode before starting the loop so a new slide never reveals an empty frame.
    void Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      ready = true;
      updatePlayback();
    });
    motion.addEventListener("change", updatePlayback);
    return () => {
      cancelled = true;
      clearInterval(timer);
      motion.removeEventListener("change", updatePlayback);
    };
  }, [slides]);

  return <div className="relative aspect-[4/5] w-full">
    {slides.map((slide, index) => <img
      key={`${slide.src}-${index}`}
      src={slide.src}
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
    />)}
  </div>;
}