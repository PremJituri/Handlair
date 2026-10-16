import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/site-shell";

export const Route = createFileRoute("/enquiry")({ head: () => ({ meta: [
  { title: "Enquiry Form — Handlair" }, { name: "description", content: "Enquire about Handlair air handling and industrial air pollution control systems." }, { property: "og:title", content: "Send an Enquiry to Handlair" }, { property: "og:description", content: "Tell Handlair about your air handling or pollution control requirement." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: EnquiryPage });

function EnquiryPage() { return <><PageHero eyebrow="Enquiry form" title="Tell us what your facility needs."><p>Share your application, site and airflow requirements so the right product or system can be discussed.</p></PageHero><section className="mx-auto max-w-4xl px-5 py-24 lg:px-8"><div className="border border-border bg-background p-6 shadow-sm md:p-10"><EnquiryForm /></div><p className="mt-5 type-body">Form delivery is not connected in this preview. For an immediate enquiry, email <strong>sales@handlair.co.in</strong>.</p></section></> }