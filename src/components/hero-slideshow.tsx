import { useEffect, useState } from "react";
import { HERO_SLIDE_INTERVAL_MS, heroSlides } from "@/data/hero-slideshow";

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const images = heroSlides.map((slide) => {
      const image = new Image();
      image.src = slide.src;
      return image;
    });
    let ready = false;
    const updatePlayback = () => {
      clearInterval(timer);
      timer = undefined;
      if (cancelled || !ready || motion.matches) return;
      timer = setInterval(() => {
        setActive((current) => (current + 1) % heroSlides.length);
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
  }, []);

  return <div className="relative aspect-[4/5] w-full">
    {heroSlides.map((slide, index) => <img
      key={slide.src}
      src={slide.src}
      alt={slide.alt}
      aria-hidden={index !== active}
      width={1024}
      height={1280}
      fetchPriority={index === 0 ? "high" : "auto"}
      decoding="async"
      className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`}
    />)}
  </div>;
}