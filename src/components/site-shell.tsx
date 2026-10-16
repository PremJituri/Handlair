import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { contact } from "@/data/handlair";
import logoAsset from "@/assets/maaria-logo.jpg.asset.json";

const nav = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Handlair home">
      <img src={logoAsset.url} alt="Maaria logo: green fan-flower emblem with the word Maaria, inside a red blower outline" width={1280} height={1160} className="h-12 w-auto object-contain sm:h-14" />
      <span><strong className="block font-display text-xl leading-none uppercase">Handlair</strong><span className="text-[10px] font-semibold uppercase text-muted-foreground">Air systems engineering</span></span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {nav.map(([label, to]) => <Link key={to} to={to} className="text-sm font-semibold uppercase text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>{label}</Link>)}
        </nav>
        <div className="hidden lg:block"><Button asChild size="lg"><Link to="/enquiry">Send an enquiry <ArrowUpRight /></Link></Button></div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-1">{nav.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="border-b border-border py-4 font-display text-xl uppercase">{label}</Link>)}<Button asChild size="lg" className="mt-4"><Link to="/enquiry" onClick={() => setOpen(false)}>Send an enquiry</Link></Button></div></nav>}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div><Logo /><p className="mt-6 max-w-sm text-muted-foreground">Equipment and systems for air handling and industrial air pollution control.</p></div>
        <div><h2 className="eyebrow">Navigate</h2><div className="mt-5 grid gap-3">{nav.map(([label, to]) => <Link key={to} to={to} className="font-semibold hover:text-primary">{label}</Link>)}</div></div>
        <div><h2 className="eyebrow">Connect</h2><div className="mt-5 space-y-3 text-sm text-muted-foreground"><a className="flex gap-2 hover:text-foreground" href={`tel:${contact.phone}`}><Phone className="size-4" />{contact.phone}</a><a className="flex gap-2 hover:text-foreground" href="mailto:sales@handlair.co.in"><Mail className="size-4" />sales@handlair.co.in</a><p>{contact.address}</p></div></div>
      </div>
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">© Handlair. All rights reserved.</div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className="pattern-grid border-b border-border"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><p className="eyebrow">{eyebrow}</p><h1 className="mt-6 max-w-5xl font-display text-4xl uppercase leading-[1.02] md:text-6xl lg:text-7xl">{title}</h1><div className="mt-7 max-w-2xl text-lg text-muted-foreground">{children}</div></div></section>;
}

export function CtaBand() {
  return <section className="bg-secondary"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-end lg:px-8"><div><p className="eyebrow">Start a conversation</p><h2 className="mt-5 max-w-3xl font-display text-4xl uppercase md:text-6xl">Looking for a reliable air handling solution?</h2></div><Button asChild size="xl"><Link to="/enquiry">Send an enquiry <ArrowUpRight /></Link></Button></div></section>;
}