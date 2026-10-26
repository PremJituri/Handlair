import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, X, ImageOff, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogueCategories, catalogueProducts } from "@/data/product-catalogue";
import { cn } from "@/lib/utils";

const pillBase = "h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-base";
const pillState = (active: boolean) => active ? "border-primary bg-primary font-bold text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "border-border bg-background hover:border-primary/60 hover:bg-secondary/40 hover:text-foreground";
const chipState = (active: boolean) => active ? "border-primary bg-secondary font-semibold text-foreground ring-1 ring-primary" : "border-border bg-background hover:border-primary/60 hover:bg-secondary/40 hover:text-foreground";

export function ProductCatalogue({ products = catalogueProducts, categories = catalogueCategories }: { products?: {slug:string;name:string;image:string;summary:string;category:string;subcategory:string}[]; categories?: readonly {id:string;name:string}[] }) {
  const [category, setCategory] = useState<string>("all");
  const [subcategory, setSubcategory] = useState("all");
  const [query, setQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const filterCatalogue = (category: string, subcategory = "all") => products.filter((p) => (category === "all" || p.category === category) && (subcategory === "all" || p.slug === subcategory));
  const categoryProducts = filterCatalogue(category);
  const items = filterCatalogue(category, subcategory).filter((product) => `${product.name} ${product.subcategory} ${product.summary}`.toLowerCase().includes(query.trim().toLowerCase()));
  const shownCategories = categories.filter((item) => products.some((p) => p.category === item.id));
  const filtered = category !== "all" || subcategory !== "all" || query.trim() !== "";

  const revealResults = () => requestAnimationFrame(() => {
    const el = resultsRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (window.innerWidth < 1024 || top > window.innerHeight * 0.6 || top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  });
  const pickCategory = (id: string) => { setCategory(id); setSubcategory("all"); revealResults(); };
  const pickSubcategory = (slug: string) => { setSubcategory(slug); revealResults(); };
  const reset = () => { setCategory("all"); setSubcategory("all"); setQuery(""); };

  const activeLabel = subcategory !== "all" ? categoryProducts.find((p) => p.slug === subcategory)?.subcategory : category === "all" ? "All Products" : categories.find((item) => item.id === category)?.name;

  return <section className="mx-auto site-container px-5 py-12 lg:px-8 lg:py-16">
    <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-8">
      <div className="relative w-full lg:max-w-sm lg:shrink-0"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" /><Input aria-label="Search products" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-10 pr-11 text-base" />{query && <Button size="icon" variant="ghost" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-0.5 top-0.5 size-10"><X /></Button>}</div>
      <nav aria-label="Product categories" className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden">
        <Button variant="ghost" aria-pressed={category === "all"} onClick={() => pickCategory("all")} className={cn(pillBase, pillState(category === "all"))}>All Products <span className="opacity-80">({products.length})</span></Button>
        {shownCategories.map((item) => { const active = category === item.id; return <Button key={item.id} variant="ghost" aria-pressed={active} onClick={() => pickCategory(item.id)} className={cn(pillBase, pillState(active))}>{item.name} <span className="opacity-80">({filterCatalogue(item.id).length})</span></Button>; })}
      </nav>
    </div>
    {category !== "all" && categoryProducts.length > 1 && <nav aria-label="Product subcategories" className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden">
      <Button variant="ghost" aria-pressed={subcategory === "all"} onClick={() => pickSubcategory("all")} className={cn("h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-base", chipState(subcategory === "all"))}>All in category</Button>
      {categoryProducts.map((product) => <Button key={product.slug} variant="ghost" aria-pressed={subcategory === product.slug} onClick={() => pickSubcategory(product.slug)} className={cn("h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-base", chipState(subcategory === product.slug))}>{product.subcategory}</Button>)}
    </nav>}
    <div ref={resultsRef} className="mt-8 scroll-mt-[calc(var(--header-slot)+1rem)]">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <p className="min-w-0 text-base" aria-live="polite">Showing <strong>{items.length}</strong> {items.length === 1 ? "product" : "products"} in <strong className="uppercase">{activeLabel}</strong>{query.trim() && <> matching “{query.trim()}”</>}</p>
        {filtered && <Button variant="ghost" onClick={reset} className="h-11 shrink-0 gap-2 rounded-full border border-border px-4 text-base hover:border-primary/60 hover:bg-secondary/40"><RotateCcw className="size-4" />Reset filter</Button>}
      </div>
      <ul key={`${category}-${subcategory}`} className="grid grid-cols-1 gap-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 min-[380px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => <li key={product.slug} className="min-w-0"><Link to="/products/$slug" params={{ slug: product.slug }} aria-label={`View details for ${product.name}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow hover:border-primary hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-secondary/30 p-3 sm:p-5">{product.image ? <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" /> : <div className="flex flex-col items-center gap-2 text-center text-muted-foreground"><ImageOff className="size-8" /><span className="text-base">Photo pending</span></div>}</div>
          <div className="flex flex-1 flex-col p-3 sm:p-5"><h3 className="text-base sm:text-xl font-display uppercase leading-snug [overflow-wrap:anywhere]">{product.name}</h3><p className="mt-3 type-body">{product.summary || "Product information pending."}</p><span className="mt-auto flex items-center justify-between gap-2 pt-6 text-base font-bold">View Details <ArrowRight className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" /></span></div>
        </Link></li>)}
      </ul>
      {items.length === 0 && <div className="border-y border-border py-14 text-center"><h3 className="type-h3">No matching products</h3><p className="mt-2 type-body">Try another search term or category.</p><Button variant="outline" className="mt-5 h-11 rounded-full text-base" onClick={reset}><X />Clear search</Button></div>}
    </div>
  </section>;
}
