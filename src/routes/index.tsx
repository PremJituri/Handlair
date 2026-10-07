import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import { CtaBand } from "@/components/site-shell";
import { gallery, heroImage, systems } from "@/data/handlair";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Handlair — Industrial Air Handling & Pollution Control" },
    { name: "description", content: "Handlair manufactures air handling equipment, industrial ventilation and air pollution control systems." },
    { property: "og:title", content: "Handlair — Industrial Air Handling & Pollution Control" },
    { property: "og:description", content: "Engineered equipment and systems for cleaner, healthier industrial environments." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <>
    <section className="pattern-grid overflow-hidden border-b border-border"><div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8 lg:py-20"><div className="animate-rise lg:col-span-7"><p className="eyebrow">Air handling & pollution control</p><h1 className="mt-6 font-display text-4xl uppercase leading-[.92] sm:text-6xl lg:text-7xl xl:text-8xl">Engineering air for <span className="text-primary">industry.</span></h1><p className="mt-8 max-w-2xl text-xl text-muted-foreground">HANDLAIR is a leading manufacturer of equipment and systems for air handling and industrial air pollution control.</p><div className="mt-9 flex flex-wrap gap-3"><Button asChild size="xl"><Link to="/products">Explore products <ArrowRight /></Link></Button><Button asChild size="xl" variant="outline"><Link to="/enquiry">Discuss a requirement</Link></Button></div></div><div className="relative lg:col-span-5"><div className="border border-border bg-background p-3 shadow-xl"><img src={heroImage} alt="Handlair industrial air handling equipment" className="aspect-[4/5] w-full object-cover" /></div><div className="absolute -bottom-5 -left-5 hidden size-32 border-b-2 border-l-2 border-primary md:block" /><MoveDown className="absolute -bottom-10 right-3 hidden size-5 text-primary lg:block" /></div></div></section>
    <section className="bg-secondary/45"><div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8"><div><p className="eyebrow">01 / Engineering excellence</p><h2 className="mt-6 font-display text-4xl uppercase leading-tight md:text-5xl">Reliable equipment. Healthier working environments.</h2></div><div><p className="text-lg text-muted-foreground">HANDLAIR technical excellence ensures reliable and cost-effective products in the air-moving industry. The company provides technical and economical consultancy for choosing appropriate products and systems with maximum efficiency.</p><Button asChild variant="link" className="mt-6 px-0"><Link to="/about">Learn about Handlair <ArrowRight /></Link></Button></div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">02 / Product range</p><h2 className="mt-5 font-display text-4xl uppercase md:text-5xl">Equipment built to move and clean air.</h2></div><Link to="/products" className="flex items-center gap-2 font-bold text-primary">View all products <ArrowRight className="size-4" /></Link></div><ProductGrid limit={6} /></section>
    <section className="border-y border-border bg-foreground text-background"><div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-2 lg:px-8"><div><p className="eyebrow">03 / Integrated systems</p><h2 className="mt-6 font-display text-4xl uppercase leading-tight md:text-5xl">A complete approach to industrial airflow.</h2><p className="mt-6 max-w-lg text-background/65">From cooling and ventilation to dust collection and fume exhaust, each system is selected around the application.</p></div><ol className="divide-y divide-background/20">{systems.map((system, index) => <li key={system} className="flex items-center gap-6 py-5"><span className="font-bold text-primary">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-xl uppercase md:text-2xl">{system}</span></li>)}</ol></div></section>
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="mb-12"><p className="eyebrow">04 / Selected work</p><h2 className="mt-5 font-display text-4xl uppercase md:text-5xl">Equipment in the field.</h2></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{gallery.slice(0, 5).map((item, i) => <Link key={item.name} to="/gallery" className={`group relative overflow-hidden bg-secondary ${i === 0 ? "col-span-2 row-span-2" : ""}`}><img src={item.image} alt={item.name} loading="lazy" className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-foreground/85 p-3 text-sm font-bold text-background">{item.name}</span></Link>)}</div></section>
    <CtaBand />
  </>;
}
