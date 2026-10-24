import bagBlue from "@/assets/hero-slideshow/Bag_Filter_Dust_Collectors-2.jpg.asset.json";
import bagSite from "@/assets/hero-slideshow/Bag_Filter_Dust_Collectors_9.jpg.asset.json";
import cyclone from "@/assets/hero-slideshow/Cyclone_Dust_Collectors-2.jpg.asset.json";
import blower from "@/assets/hero-slideshow/IMG-20261013-WA0014-2.jpg.asset.json";
import blowerSite from "@/assets/hero-slideshow/IMG-20261022-WA0035.jpg.asset.json";
import installation from "@/assets/hero-slideshow/IMG-20261022-WA0043.jpg.asset.json";
import bagGreen from "@/assets/hero-slideshow/Bag_Filter_Dust_Collectors_2.jpg.asset.json";
import bagTall from "@/assets/hero-slideshow/Bag_Filter_Dust_Collectors_3.jpg.asset.json";
import bagOutdoor from "@/assets/hero-slideshow/Bag_Filter_Dust_Collectors_5.jpg.asset.json";
import bagPlant from "@/assets/hero-slideshow/Bag_Filter_Dust_Collectors_8.jpg.asset.json";

// Owner's settings: one image every 6 seconds. The crossfade must stay well
// inside that window so the timer and the dissolve never overlap.
export const HERO_SLIDE_INTERVAL_MS = 6000;
export const HERO_SLIDE_CROSSFADE_MS = 1200;

// Keep this list in the owner's upload order.
export const heroSlides = [
  { src: bagBlue.url, alt: "Blue bag filter dust collector" },
  { src: bagSite.url, alt: "Green dust collector installed beside an industrial building" },
  { src: cyclone.url, alt: "Blue cyclone dust collector with ductwork" },
  { src: blower.url, alt: "Blue centrifugal blower" },
  { src: blowerSite.url, alt: "Centrifugal blower and exhaust duct installation" },
  { src: installation.url, alt: "Industrial air handling installation inside a factory" },
  { src: bagGreen.url, alt: "Green bag filter dust collector" },
  { src: bagTall.url, alt: "Tall blue bag filter dust collector" },
  { src: bagOutdoor.url, alt: "Green dust collector with access ladder and platform" },
  { src: bagPlant.url, alt: "Outdoor dust collection equipment and ductwork" },
] as const;