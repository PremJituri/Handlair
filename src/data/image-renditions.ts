import photo0 from "@/assets/optimized/Bag_Filter_Dust_Collectors-2.webp.asset.json";
import photo1 from "@/assets/optimized/Bag_Filter_Dust_Collectors_2.webp.asset.json";
import photo2 from "@/assets/optimized/Bag_Filter_Dust_Collectors_3.webp.asset.json";
import photo3 from "@/assets/optimized/Bag_Filter_Dust_Collectors_5.webp.asset.json";
import photo4 from "@/assets/optimized/Bag_Filter_Dust_Collectors_8.webp.asset.json";
import photo5 from "@/assets/optimized/Bag_Filter_Dust_Collectors_9.webp.asset.json";
import photo6 from "@/assets/optimized/Cyclone_Dust_Collectors-2.webp.asset.json";
import photo7 from "@/assets/optimized/IMG-20261013-WA0014-2.webp.asset.json";
import photo8 from "@/assets/optimized/IMG-20261022-WA0035.webp.asset.json";
import photo9 from "@/assets/optimized/IMG-20261022-WA0043.webp.asset.json";
import photo10 from "@/assets/optimized/product-air-cooling-unit.webp.asset.json";
import photo11 from "@/assets/optimized/product-bag-filter-dust-collectors.webp.asset.json";
import photo12 from "@/assets/optimized/product-cyclone-dust-collectors.webp.asset.json";
import photo13 from "@/assets/optimized/product-wet-scrubbers.webp.asset.json";

// Only immutable owner-supplied assets are substituted; CMS uploads pass through unchanged.
const renditions = new Map<string, string>([
  [
    "/__l5e/assets-v1/fe56d628-2fee-406c-a721-3243915a6c1a/Bag_Filter_Dust_Collectors-2.jpg",
    photo0.url,
  ],
  [
    "/__l5e/assets-v1/ed20949a-886c-4ee4-833f-4ab7539d774c/Bag_Filter_Dust_Collectors_2.jpg",
    photo1.url,
  ],
  [
    "/__l5e/assets-v1/9d60b2fb-8624-4544-8a72-0c66bef6bcbb/Bag_Filter_Dust_Collectors_3.jpg",
    photo2.url,
  ],
  [
    "/__l5e/assets-v1/c7f976dd-3752-4ecf-91f3-8c6ebde0302d/Bag_Filter_Dust_Collectors_5.jpg",
    photo3.url,
  ],
  [
    "/__l5e/assets-v1/319082ab-73d5-4e9d-b37e-27852638ad4b/Bag_Filter_Dust_Collectors_8.jpg",
    photo4.url,
  ],
  [
    "/__l5e/assets-v1/1aca71a2-88b7-4483-8f1a-70a40b93cc0a/Bag_Filter_Dust_Collectors_9.jpg",
    photo5.url,
  ],
  [
    "/__l5e/assets-v1/fc909cd1-aa4d-4de4-8aae-770fd2b14f89/Cyclone_Dust_Collectors-2.jpg",
    photo6.url,
  ],
  ["/__l5e/assets-v1/1e5d714b-d70a-4ea0-b179-b314b69e1e22/IMG-20261013-WA0014-2.jpg", photo7.url],
  ["/__l5e/assets-v1/91830500-f7d4-4fd7-91a0-1745176e2642/IMG-20261022-WA0035.jpg", photo8.url],
  ["/__l5e/assets-v1/bc44a439-0ea3-492e-b60b-041fdee0b2c8/IMG-20261022-WA0043.jpg", photo9.url],
  [
    "/__l5e/assets-v1/b898a9b6-c13a-49c9-827e-0617655a93f2/product-air-cooling-unit.jpg",
    photo10.url,
  ],
  [
    "/__l5e/assets-v1/86ec5226-bbfa-40fd-a308-5b1f88399ad8/product-bag-filter-dust-collectors.jpg",
    photo11.url,
  ],
  [
    "/__l5e/assets-v1/7c8c895e-0aac-4745-8bdb-edc6a605198f/product-cyclone-dust-collectors.jpg",
    photo12.url,
  ],
  ["/__l5e/assets-v1/bb40cc3e-b553-4b9f-9423-75286007fa7f/product-wet-scrubbers.jpg", photo13.url],
]);

export function optimizedPhotoUrl(source: string): string {
  return renditions.get(source) ?? source;
}
