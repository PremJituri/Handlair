import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/data/handlair";

export function ProductGrid({ limit }: { limit?: number }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, limit).map((product) => <Link key={product.slug} to="/products/$slug" params={{ slug: product.slug }} className="glass-surface group flex flex-col p-3 transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><div className="mb-3 aspect-[4/3] overflow-hidden bg-secondary"><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-2 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]" /></div><div className="flex items-start justify-between gap-3"><h3 className="font-display text-base font-bold uppercase leading-tight">{product.name}</h3><ArrowUpRight className="size-5 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1" /></div><p className="mt-2 type-body">{product.summary}</p></Link>)}</div>;
}