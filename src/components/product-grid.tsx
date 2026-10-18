import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/data/handlair";

export function ProductGrid({ limit }: { limit?: number }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, limit).map((product, index) => <Link key={product.slug} to="/products/$slug" params={{ slug: product.slug }} className="glass-surface group p-5 transition-shadow hover:shadow-lg md:p-7"><div className="mb-6 aspect-[4/3] overflow-hidden bg-secondary"><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" /></div><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-2 type-h3">{product.name}</h3></div><ArrowUpRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><p className="mt-4 type-body">{product.summary}</p></Link>)}</div>;
}