import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Magnetic, MagneticLabel } from "@/components/core/magnetic";
import { contact } from "@/data/handlair";
import logoAsset from "@/assets/maaria-logo.jpg.asset.json";

const nav = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
] as const;

const springOptions = { bounce: 0.1 };

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
    <header className="glass-surface sticky top-3 z-50 mx-3 mt-3 mb-3 sm:mx-5 lg:mx-8 xl:mx-auto xl:w-[calc(100%-4rem)] xl:max-w-7xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 lg:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {nav.map(([label, to]) => <Link key={to} to={to} className="text-sm font-semibold uppercase text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>{label}</Link>)}
        </nav>
        <div className="hidden lg:block"><Magnetic intensity={0.2} springOptions={springOptions} actionArea="global" range={200}><Button asChild size="lg" className="rounded-lg"><Link to="/enquiry"><MagneticLabel>Send an enquiry <ArrowUpRight /></MagneticLabel></Link></Button></Magnetic></div>
        <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav id="mobile-navigation" className="max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-b-lg border-t border-border bg-background/80 px-5 py-5 lg:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-1">{nav.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="border-b border-border py-4 font-display text-xl uppercase">{label}</Link>)}<Magnetic intensity={0.2} springOptions={springOptions} actionArea="global" range={200} className="w-full"><Button asChild size="lg" className="mt-4 w-full rounded-lg"><Link to="/enquiry" onClick={() => setOpen(false)}>Send an enquiry</Link></Button></Magnetic></div></nav>}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div><Logo /><p className="mt-6 max-w-sm type-body">Equipment and systems for air handling and industrial air pollution control.</p></div>
        <div><h2 className="eyebrow">Navigate</h2><div className="mt-5 grid gap-3">{nav.map(([label, to]) => <Link key={to} to={to} className="font-semibold hover:text-primary">{label}</Link>)}</div></div>
        <div><h2 className="eyebrow">Connect</h2><div className="mt-5 space-y-3 type-body"><a className="flex gap-2 hover:text-foreground" href={`tel:${contact.phone}`}><Phone className="size-4" />{contact.phone}</a><a className="flex gap-2 hover:text-foreground" href="mailto:sales@handlair.co.in"><Mail className="size-4" />sales@handlair.co.in</a><p>{contact.address}</p></div></div>
      </div>
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">© Handlair. All rights reserved.</div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /></>; }

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className="pattern-grid border-b border-border"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><p className="eyebrow">{eyebrow}</p><h1 className="mt-6 max-w-5xl type-page">{title}</h1><div className="mt-7 max-w-2xl type-lead">{children}</div></div></section>;
}

export function CtaBand() {
  return <section className="bg-secondary"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-end lg:px-8"><div><p className="eyebrow">Start a conversation</p><h2 className="mt-5 max-w-3xl type-h2">Looking for a reliable air handling solution?</h2></div><Magnetic intensity={0.2} springOptions={springOptions} actionArea="global" range={200}><Button asChild size="xl" className="rounded-lg"><Link to="/enquiry"><MagneticLabel>Send an enquiry <ArrowUpRight /></MagneticLabel></Link></Button></Magnetic></div></section>;
}
