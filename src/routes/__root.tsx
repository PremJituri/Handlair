import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ArrowUpRight, Undo2 } from "lucide-react";
import type { LottieComponentProps, LottieRefCurrentProps } from "lottie-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import animation404 from "@/assets/table-fan-404.json";

/**
 * Table-fan 404 animation. lottie-react touches the DOM, so it is loaded
 * client-side after hydration; SSR renders an equally sized placeholder so
 * nothing shifts. Reduced-motion visitors get the scene frozen on a keyframe.
 */
function NotFoundLottie() {
  const [Lottie, setLottie] = useState<ComponentType<LottieComponentProps> | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("lottie-react").then((mod) => {
      if (!cancelled) setLottie(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!reduced || !Lottie) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      if (lottieRef.current) {
        lottieRef.current.goToAndStop(150, true);
        window.clearInterval(timer);
      } else if (++tries > 20) {
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [reduced, Lottie]);

  return (
    <div role="img" aria-label="Animated table fan with 404 sparks, a playful nod to lost airflow" className="w-full max-w-md">
      {Lottie ? (
        <Lottie lottieRef={lottieRef} animationData={animation404} loop={!reduced} autoplay={!reduced} className="h-auto w-full" />
      ) : (
        <div className="aspect-[1044/900] w-full" aria-hidden="true" />
      )}
    </div>
  );
}

function NotFoundComponent() {
  const router = useRouter();
  return (
    <section className="pattern-grid -mt-[var(--header-slot)] overflow-hidden border-b border-border">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col items-center justify-center px-5 pb-16 pt-[calc(5rem+var(--header-slot))] text-center lg:px-8 lg:pb-24 lg:pt-[calc(7rem+var(--header-slot))]">
        <p className="eyebrow">ERROR 404 / AIRFLOW DISRUPTED</p>
        <div className="mt-8 animate-rise">
          <NotFoundLottie />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] md:text-5xl">
          This duct leads nowhere.
        </h1>
        <p className="mt-4 max-w-xl type-lead">
          The page or equipment spec you are looking for has been <strong className="text-foreground">moved, decommissioned</strong>, or lost in the ventilation ductwork.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="xl">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link to="/products">Explore Product Range</Link>
          </Button>
        </div>
        <Link
          to="/contact"
          className="mt-4 inline-flex items-center gap-1.5 font-bold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
        >
          Contact Engineering Support <ArrowUpRight className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => router.history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <Undo2 className="size-4" /> Go back to previous page
        </button>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Handlair" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <SiteShell><Outlet /></SiteShell>
    </QueryClientProvider>
  );
}
