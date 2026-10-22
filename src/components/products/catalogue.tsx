import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers3, Search, X, ImageOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogueCategories, catalogueProducts, filterCatalogue, type CatalogueCategory } from "@/data/product-catalogue";
import { cn } from "@/lib/utils";

export function ProductCatalogue() {
  const [category, setCategory] = useState<CatalogueCategory | "all">("all");
  const [subcategory, setSubcategory] = useState("all");
  const [query, setQuery] = useState("");
  const categoryProducts = filterCatalogue(category);
  const items = filterCatalogue(category, subcategory).filter((product) => `${product.name} ${product.subcategory} ${product.summary}`.toLowerCase().includes(query.trim().toLowerCase()));
  const reset = () => { setCategory("all"); setSubcategory("all"); setQuery(""); };

  return <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
    <nav aria-label="Product categories" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {catalogueCategories.map((item, index) => { const active = category === item.id; return <Button key={item.id} variant="ghost" aria-pressed={active} onClick={() => { setCategory(item.id); setSubcategory("all"); }} className={cn("group h-auto min-h-24 justify-between whitespace-normal rounded-lg border p-5 text-left text-base hover:bg-secondary/40 hover:text-foreground", active ? "border-primary bg-secondary text-foreground ring-1 ring-primary" : "border-border bg-background hover:border-primary/60")}>
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="font-normal text-muted-foreground">0{index + 1} / {filterCatalogue(item.id).length} products</span>
          <span className="font-semibold uppercase">{item.name}</span>
        </span>
        <span aria-hidden="true" className={cn("ml-4 flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent group-hover:border-primary/60 group-hover:bg-secondary")}>
          <ArrowRight className="transition-transform motion-safe:group-hover:translate-x-0.5" />
        </span>
      </Button>; })}
    </nav>
    <div className="mt-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <Button variant="ghost" onClick={reset} aria-pressed={category === "all"} className={cn("group h-11 w-fit shrink-0 gap-2.5 rounded-full border px-4 text-base hover:bg-secondary/40 hover:text-foreground", category === "all" ? "border-primary bg-secondary text-foreground" : "border-border bg-background hover:border-primary/60")}>
        <Layers3 />
        Full catalogue
        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-normal text-muted-foreground">{catalogueProducts.length}</span>
      </Button>
      <div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="Search products" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-10 pr-10 text-base" />{query && <Button size="icon" variant="ghost" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-1 top-1"><X /></Button>}</div>
    </div>
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="min-w-0"><h2 className="mb-4 font-bold uppercase">Subcategories</h2><nav aria-label="Product subcategories" className="flex gap-2 overflow-x-auto pb-3 lg:flex-col lg:overflow-visible">
        <Button variant="ghost" aria-pressed={subcategory === "all"} onClick={() => setSubcategory("all")} className={cn("min-h-11 shrink-0 justify-start text-base lg:h-auto lg:whitespace-normal lg:py-3 lg:text-left", subcategory === "all" && "bg-secondary")}>All in {category === "all" ? "catalogue" : "category"}</Button>
        {categoryProducts.map((product) => <Button key={product.slug} variant="ghost" aria-pressed={subcategory === product.slug} onClick={() => setSubcategory(product.slug)} className={cn("min-h-11 shrink-0 justify-start text-base lg:h-auto lg:whitespace-normal lg:py-3 lg:text-left", subcategory === product.slug && "bg-secondary")}>{product.subcategory}</Button>)}
      </nav></aside>
      <div className="min-w-0"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-bold uppercase">{subcategory !== "all" ? categoryProducts.find((product) => product.slug === subcategory)?.subcategory : category === "all" ? "All products" : catalogueCategories.find((item) => item.id === category)?.name}</h2><span className="shrink-0 text-base text-muted-foreground" aria-live="polite">{items.length} {items.length === 1 ? "product" : "products"}</span></div>
        <ul className="grid grid-cols-1 gap-5 min-[380px]:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => <li key={product.slug} className="min-w-0"><Link to="/products/$slug" params={{ slug: product.slug }} aria-label={`View details for ${product.name}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow hover:border-primary hover:shadow-lg focus-visible:outline-2 focus-visible:outline-ring">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-secondary/30 p-3 sm:p-5">{product.image ? <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" /> : <div className="flex flex-col items-center gap-2 text-center text-muted-foreground"><ImageOff className="size-8" /><span className="text-base">Photo pending</span></div>}</div>
            <div className="flex flex-1 flex-col p-3 sm:p-5"><h3 className="text-base sm:text-xl font-display uppercase leading-snug [overflow-wrap:anywhere]">{product.name}</h3><p className="mt-3 type-body">{product.summary || "Product information pending."}</p><span className="mt-auto flex items-center justify-between gap-2 pt-6 text-base font-bold">View Details <ArrowRight className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" /></span></div>
          </Link></li>)}
        </ul>
        {items.length === 0 && <div className="border-y border-border py-14 text-center"><h3 className="type-h3">No matching products</h3><Button variant="link" className="mt-4 text-base" onClick={reset}>Return to full catalogue <ArrowRight /></Button></div>}
      </div>
    </div>
  </section>;
}