import { createFileRoute } from "@tanstack/react-router";
import { pageSeo } from "@/lib/seo";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/site-shell";

export const Route = createFileRoute("/enquiry")({
  head: () =>
    pageSeo(
      "/enquiry",
      "Send an Enquiry — Industrial Air Systems | Handlair",
      "Tell Handlair about your air handling, ventilation, dust collection or pollution control requirement and our engineers will get back to you.",
    ),
  component: EnquiryPage,
});

function EnquiryPage() {
  return (
    <>
      <PageHero eyebrow="Enquiry form" title="Tell us what your facility needs.">
        <p>
          Share your application, site and airflow requirements so the right product or system can
          be discussed.
        </p>
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-24 lg:px-8">
        <div className="glass-surface p-6 md:p-10">
          <EnquiryForm />
        </div>
        <p className="mt-5 type-body">
          For an urgent requirement, call <strong>0129-2229101</strong> or email{" "}
          <strong>sales@handlair.co.in</strong>.
        </p>
      </section>
    </>
  );
}
