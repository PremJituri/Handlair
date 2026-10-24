import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Globe2, LifeBuoy, Tag, Truck } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About Handlair Engineering Technologies — Industrial Air Solutions",
      },
      {
        name: "description",
        content:
          "Handlair Engineering Technologies, founded in 1995 and based in Faridabad, Haryana, brings over three decades of experience in industrial air handling, ventilation and air pollution control.",
      },
      {
        property: "og:title",
        content: "About Handlair Engineering Technologies",
      },
      {
        property: "og:description",
        content:
          "Over three decades of practical engineering, quality workmanship and customer service in industrial air solutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const capabilities = [
  "Centrifugal blowers",
  "Axial flow fans",
  "Industrial man coolers",
  "Roof extractors",
  "Air cooling units",
  "Fresh air units",
  "Cyclone dust collectors",
  "Bag filters",
  "Wet scrubbers",
  "Air filtration equipment",
];

const applications = [
  "Automotive",
  "Food processing",
  "General engineering",
  "Cement",
  "Paint shops",
  "Pneumatic conveying systems",
  "Generator ventilation",
];

const commitments = [
  {
    icon: BadgeCheck,
    title: "Dependable performance",
    copy: "Equipment selected and built for continuous industrial service.",
  },
  {
    icon: Tag,
    title: "Competitive pricing",
    copy: "Practical solutions priced around the requirement in front of them.",
  },
  {
    icon: Truck,
    title: "Timely delivery",
    copy: "Schedules kept so installation and commissioning can move ahead.",
  },
  {
    icon: LifeBuoy,
    title: "Responsive after-sales support",
    copy: "Help that stays available once equipment is in service.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Handlair" title="Handlair Engineering Technologies">
        <p className="font-display text-xl font-bold uppercase leading-snug text-foreground md:text-2xl">
          Over Three Decades of Industrial Air Solutions
        </p>
        <p className="mt-5">
          Based in Faridabad, Haryana, Handlair works on practical engineering, quality workmanship
          and customer service across industrial air handling, ventilation and air pollution
          control.
        </p>
      </PageHero>

      <section className="bg-secondary/45">
        <div className="mx-auto grid site-container gap-8 px-5 py-16 md:py-20 lg:grid-cols-[.7fr_1.3fr] lg:gap-12 lg:px-8">
          <div>
            <p className="eyebrow">01 / Company history</p>
            <h2 className="mt-5 type-h2">Three decades of air handling experience.</h2>
          </div>
          <div className="space-y-6">
            <p className="type-lead">
              Founded in <strong className="text-foreground">1995 by A. D. Augustine</strong>,
              Handlair brings over three decades of experience in industrial air handling,
              ventilation and air pollution control. Its journey includes the incorporation of{" "}
              <strong className="text-foreground">
                Handlair Engineers Private Limited on 16 May 2013
              </strong>
              , an important milestone in its business history. Today,{" "}
              <strong className="text-foreground">Handlair Engineering Technologies</strong>{" "}
              carries forward the Handlair name with a focus on practical engineering, quality
              workmanship and customer service.
            </p>
            <div className="grid grid-cols-1 border-t border-border sm:grid-cols-2">
              <div className="h-full py-5 sm:pr-6">
                <span className="text-base font-bold text-primary">1995</span>
                <h3 className="mt-3 type-h3">Founded</h3>
                <p className="mt-2 type-body">
                  Handlair is founded by A. D. Augustine, beginning its work in industrial air
                  handling.
                </p>
              </div>
              <div className="h-full border-t border-border py-5 sm:border-l sm:border-t-0 sm:pl-6">
                <span className="text-base font-bold text-primary">16 May 2013</span>
                <h3 className="mt-3 type-h3">Incorporated</h3>
                <p className="mt-2 type-body">
                  Handlair Engineers Private Limited is incorporated — a milestone in the
                  company&rsquo;s business history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto site-container px-5 py-16 md:py-20 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end lg:gap-12">
          <div>
            <p className="eyebrow">02 / Products and capabilities</p>
            <h2 className="mt-5 type-h2">Equipment for moving and cleaning air.</h2>
          </div>
          <p className="type-body">
            These solutions support industrial <strong>ventilation, cooling, pressurisation, dust
            collection and fume extraction</strong>.
          </p>
        </div>
        <ul className="grid auto-rows-fr border-l border-t border-border sm:grid-cols-2">
          {capabilities.map((item, i) => (
            <li key={item} className="flex min-w-0 items-center gap-4 border-b border-r border-border px-5 py-4">
              <span className="shrink-0 text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-base font-bold uppercase leading-snug">{item}</h3>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto grid site-container gap-8 px-5 py-16 md:py-20 lg:grid-cols-[.7fr_1.3fr] lg:gap-12 lg:px-8">
          <div>
            <p className="eyebrow">03 / Industries and applications</p>
            <h2 className="mt-5 type-h2">Where Handlair equipment works.</h2>
            <p className="mt-6 type-body">
              Technical guidance and equipment selection form part of the approach, helping
              customers identify solutions suited to their operating requirements.
            </p>
          </div>
          <div className="grid content-start gap-x-6 sm:grid-cols-2">
            {[applications.slice(0, 4), applications.slice(4)].map((column, columnIndex) => (
              <ul key={columnIndex} className="border-t border-border">
                {column.map((item, i) => (
                  <li key={item} className="flex min-h-20 items-center gap-4 border-b border-border px-4 py-4">
                    <span className="shrink-0 text-xs font-bold text-primary">
                      {String(columnIndex * 4 + i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="min-w-0 font-display text-base font-bold uppercase leading-snug">{item}</h3>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto site-container px-5 py-16 md:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-center lg:gap-12">
          <div>
            <p className="eyebrow">04 / Export experience</p>
            <h2 className="mt-5 type-h2">Reaching Southeast Asia.</h2>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 border-y border-border py-6">
            <Globe2 className="size-8 shrink-0 text-primary" aria-hidden />
            <p className="type-body">
              Beyond its domestic business, Handlair&rsquo;s export experience extends to{" "}
              <strong>Southeast Asia, including Vietnam</strong>, adding an international dimension
              to its engineering and supply capabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/45">
        <div className="mx-auto site-container px-5 py-16 md:py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12">
            <div>
              <p className="eyebrow">05 / Customer commitment</p>
              <h2 className="mt-5 type-h2">Built on lasting relationships.</h2>
            </div>
            <p className="type-lead self-end">
              With an emphasis on <strong className="text-foreground">dependable performance</strong>
              , <strong className="text-foreground">competitive pricing</strong>,{" "}
              <strong className="text-foreground">timely delivery</strong> and{" "}
              <strong className="text-foreground">responsive after-sales support</strong>, Handlair
              remains committed to building lasting customer relationships and supporting cleaner,
              better-ventilated industrial workplaces.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-4 lg:grid-cols-4 lg:gap-x-8">
            {commitments.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="row-span-3 grid h-full min-w-0 grid-rows-subgrid gap-4 border-t border-border pt-6">
                <Icon className="size-6 text-primary" aria-hidden />
                <h3 className="font-display text-base font-bold uppercase leading-snug md:text-xl">{title}</h3>
                <p className="type-body">{copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 border-t border-border pt-10 text-center font-display text-2xl font-bold uppercase tracking-wide text-primary md:text-3xl">
            Engineering Air Solutions Since 1996.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
