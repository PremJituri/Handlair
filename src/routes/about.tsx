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
          "Handlair Engineering Technologies, founded in 1996 and based in Faridabad, Haryana, brings over three decades of experience in industrial air handling, ventilation and air pollution control.",
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

      <section className="bg-secondary/35">
        <div className="mx-auto site-container px-5 py-20 md:py-24 lg:px-8">
          <div>
            <p className="eyebrow">01 / Company history</p>
            <h2 className="mt-5 type-h2">Three decades of air handling experience.</h2>
          </div>
          <p className="mt-6 max-w-3xl type-lead">
            Founded in <strong className="text-foreground">1996 by A. D. Augustine</strong>,
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

        </div>
      </section>

      <section className="mx-auto site-container px-5 py-20 md:py-24 lg:px-8">
        <div className="mb-10">
          <div>
            <p className="eyebrow">02 / Products and capabilities</p>
            <h2 className="mt-5 type-h2">Equipment for moving and cleaning air.</h2>
          </div>
          <p className="mt-6 max-w-3xl type-body">
            These solutions support industrial <strong>ventilation, cooling, pressurisation, dust
            collection and fume extraction</strong>.
          </p>
        </div>
        <ul className="grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
          {capabilities.map((item, i) => (
            <li key={item} className="flex h-full min-w-0 flex-col items-start justify-center gap-2 border border-border/60 px-3 py-4 sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:px-5">
              <span className="shrink-0 text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="min-w-0 break-words font-display text-sm font-bold uppercase leading-snug sm:text-base">{item}</h3>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-secondary/35">
        <div className="mx-auto site-container px-5 py-20 md:py-24 lg:px-8">
          <div>
            <p className="eyebrow">03 / Industries and applications</p>
            <h2 className="mt-5 type-h2">Where Handlair equipment works.</h2>
            <p className="mt-6 max-w-3xl type-body">
              Technical guidance and equipment selection form part of the approach, helping
              customers identify solutions suited to their operating requirements.
            </p>
          </div>
          <ul className="mt-10 grid auto-rows-fr grid-cols-4 gap-3 lg:grid-cols-8 lg:gap-4">
            {applications.map((item, i) => (
              <li key={item} className={`col-span-2 flex h-full min-w-0 items-center gap-3 border border-border/60 px-3 py-4 sm:px-5 ${i === 4 ? "lg:col-start-2" : i === 5 ? "lg:col-start-4" : i === 6 ? "col-start-2 lg:col-start-6" : ""}`}>
                <span className="shrink-0 text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="min-w-0 break-words font-display text-base font-bold uppercase leading-snug">{item}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto site-container px-5 py-20 md:py-24 lg:px-8">
        <div>
          <div>
            <p className="eyebrow">04 / Export experience</p>
            <h2 className="mt-5 type-h2">Reaching Southeast Asia.</h2>
          </div>
          <div className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 border-y border-border py-8">
            <Globe2 className="size-8 shrink-0 text-primary" aria-hidden />
            <p className="max-w-3xl type-lead">
              Beyond its domestic business, Handlair&rsquo;s export experience extends to{" "}
              <strong>Southeast Asia, including Vietnam</strong>, adding an international dimension
              to its engineering and supply capabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/35">
        <div className="mx-auto site-container px-5 py-20 md:py-24 lg:px-8">
          <div>
            <div>
              <p className="eyebrow">05 / Customer commitment</p>
              <h2 className="mt-5 type-h2">Built on lasting relationships.</h2>
            </div>
            <p className="mt-6 max-w-3xl type-lead">
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
          <p className="mt-16 border-t border-border pb-4 pt-12 text-center font-display text-2xl font-bold uppercase tracking-wide text-primary md:text-3xl">
            Engineering Air Solutions Since 1996.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
