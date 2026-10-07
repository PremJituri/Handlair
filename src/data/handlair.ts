import axial from "@/assets/axial.jpg.asset.json";
import bagfilter from "@/assets/bagfilter.jpg.asset.json";
import blower from "@/assets/blower.jpg.asset.json";
import cooling from "@/assets/cooling.jpg.asset.json";
import cyclone from "@/assets/cyclone.jpg.asset.json";
import filters from "@/assets/filters.jpg.asset.json";
import gallery1 from "@/assets/gallery1.jpg.asset.json";
import gallery2 from "@/assets/gallery2.jpg.asset.json";
import gallery3 from "@/assets/gallery3.jpg.asset.json";
import gallery4 from "@/assets/gallery4.jpg.asset.json";
import gallery5 from "@/assets/gallery5.jpg.asset.json";
import gallery6 from "@/assets/gallery6.jpg.asset.json";
import hero from "@/assets/hero.png.asset.json";
import mancooler from "@/assets/mancooler.jpg.asset.json";
import roof from "@/assets/roof.jpg.asset.json";
import scrubber from "@/assets/scrubber.jpg.asset.json";

export type Product = {
  slug: string;
  name: string;
  image: string;
  summary: string;
  detail: string;
  specifications?: string[];
};

export const heroImage = hero.url;

export const products: Product[] = [
  {
    slug: "centrifugal-blowers",
    name: "Centrifugal Blowers",
    image: blower.url,
    summary: "Air-moving equipment for cooling, conveying, exhaust and process applications.",
    detail: "HANDLAIR manufactures centrifugal blowers for air cooling, flour mills, foundries, fertilizer, fume exhaust, paint booths, paper mills, pneumatic conveying, rice mills and steel plants. Impellers are designed for their application and dynamically balanced for vibration-free operation.",
    specifications: ["Capacity: 200 to 1,75,000 cu. mtr/hr", "Pressure: up to 1200 mm.wg", "Construction: mild steel, stainless steel or MS with FRP coating"],
  },
  {
    slug: "axial-flow-fans",
    name: "Axial Flow Fans",
    image: axial.url,
    summary: "High-volume fans for ventilation, spot cooling and fresh-air applications.",
    detail: "HANDLAIR axial flow fans serve generator ventilation and sound proofing, air cooling, mining, tunnels, humidification plants, textile mills, driers, fresh-air and exhaust applications. Two-stage fans are manufactured for mining and tunnel ventilation.",
    specifications: ["Capacity: 1,000 to 1,75,000 cu. mtr/hr", "Pressure: up to 80 mm.wg", "Diameter: 300 to 1600 mm"],
  },
  {
    slug: "air-cooling-units",
    name: "Air Cooling Units",
    image: cooling.url,
    summary: "Filtered evaporative cooling for comfortable industrial working conditions.",
    detail: "Fresh filtered air passes through water-absorbing cellulose fill media, losing heat before it is supplied to the work area. Units are available with single or multiple blowers and spray-type cooling sections to suit customer requirements.",
    specifications: ["Capacity: 2,500 to 2,00,000 cu. mtr/hr", "Single-skin or double-skin construction", "Powder-coated G.P. sheet chamber"],
  },
  {
    slug: "bag-filter-dust-collectors",
    name: "Bag Filter Dust Collectors",
    image: bagfilter.url,
    summary: "High-efficiency dust collection for grinding, mixing and production processes.",
    detail: "HANDLAIR bag filter dust collectors use efficient polyester or polypropylene needle-felt media in plain or pleated construction. Filter bags may be cleaned by compressed-air pulse, motorized shaking or manual shaking mechanisms.",
    specifications: ["Capacity: 500 to 50,000 cu. mtr/hr", "Plain or pleated filter media", "Pulse-jet and shaking cleaning options"],
  },
  {
    slug: "cyclone-dust-collectors",
    name: "Cyclone Dust Collectors",
    image: cyclone.url,
    summary: "Robust pre-collection and dust separation for demanding industrial processes.",
    detail: "HANDLAIR cyclone dust collectors are used for grinding, polishing, buffing, foundries, pneumatic conveying, cement, food processing, powder coating and transfer points. They can operate singly or in multiple units.",
    specifications: ["Capacity: 300 to 50,000 cu. mtr/hr", "Single or multiple units", "Mild-steel or stainless-steel construction"],
  },
  {
    slug: "wet-scrubbers",
    name: "Wet Scrubbers",
    image: scrubber.url,
    summary: "Venturi and spray-type systems for coarse dust and industrial fume exhaust.",
    detail: "HANDLAIR wet-type dust collectors suit varied applications. Venturi scrubbers are used for coarse dust in coal handling and ceramic industries, while spray scrubbers serve industrial fume and commercial kitchen exhaust.",
  },
  {
    slug: "filters",
    name: "Filters",
    image: filters.url,
    summary: "Washable prefilters and oil-bath filters for ventilation plants.",
    detail: "HANDLAIR prefilters are washable and available in rod or pleated configurations. Oil-bath filters are developed for ventilation plants where surrounding-air dust concentration is comparatively heavy.",
    specifications: ["Prefilter efficiency: greater than 90% down to 10 micron", "Micron rating: 5 to 25 micron", "G.I., aluminium or stainless-steel frames"],
  },
  {
    slug: "industrial-mancoolers",
    name: "Industrial Mancoolers",
    image: mancooler.url,
    summary: "Long-sweep, high-velocity air movement for shop floors and equipment cooling.",
    detail: "HANDLAIR mancoolers are designed for large air-volume discharge with high velocity and long-distance sweep. Applications include furnaces, electrical equipment, spot cooling and general shop-floor ventilation.",
    specifications: ["Pedestal type", "Column-mounted type", "Tubular type"],
  },
  {
    slug: "roof-extractors",
    name: "Roof Extractors",
    image: roof.url,
    summary: "Roof-level extraction of hot and stale air from large industrial halls.",
    detail: "HANDLAIR roof extractors are axial flow fans used at roof level in boiler and bunker houses, power plants, steel plants, cement and automobile industries. Exhaust hoods help prevent the entry of rain water and birds.",
  },
];

export const systems = ["Air Cooling Systems", "Ventilation Systems", "Pressurisation Systems", "Air Filtration Systems", "Dust Collection Systems", "Fume Exhausting Systems"];

export const gallery = [
  { image: gallery1.url, name: "Air Cooling System" },
  { image: gallery2.url, name: "Dust Collector with Silencer" },
  { image: gallery3.url, name: "High Temperature Blower" },
  { image: gallery4.url, name: "Bifurcated Fan" },
  { image: gallery5.url, name: "Roof Extractor" },
  { image: gallery6.url, name: "Welding Fume Exhaust" },
];

export const contact = {
  address: "Indira Industrial Complex, Jeevan Nagar, Wazirpur Road, Old Faridabad, Haryana – 121002",
  phone: "0129-2229101",
  mobiles: "+91-9811164523 / 9910494523",
  emails: "sales@handlair.co.in / handlairdelhi@gmail.com",
};