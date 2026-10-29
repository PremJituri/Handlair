import { createFileRoute } from "@tanstack/react-router";
import { pageSeo } from "@/lib/seo";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/site-shell";
import { contact } from "@/data/handlair";

export const Route = createFileRoute("/contact")({ head: () => pageSeo("/contact", "Contact Handlair — Faridabad Works & Sales Office", "Get in touch with Handlair Engineering Technologies in Faridabad, Haryana for technical guidance, equipment selection, and industrial air system enquiries."), component: ContactPage });

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.7072667634734!2d77.33577567695254!3d28.42808859333276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdd0b4df45443%3A0x9606f598f4133489!2sHandlair%20Engineering%20Technologies!5e0!3m2!1sen!2sin!4v1792851952141!5m2!1sen!2sin";

function ContactPage() { return <><PageHero eyebrow="Contact" title="Talk to our team."><p>Share your requirements or contact Handlair directly for product and system enquiries.</p></PageHero><section className="mx-auto grid site-container gap-14 px-5 py-24 lg:grid-cols-[.7fr_1.3fr] lg:px-8"><div className="space-y-8"><ContactItem icon={<MapPin />} label="Address" value={`${contact.company}\n${contact.address}`} /><ContactItem icon={<Phone />} label="Phone" value={`${contact.phone}\n${contact.mobiles.map((mobile) => mobile.label).join(" / ")}`} /><ContactItem icon={<Mail />} label="Email" value={contact.emails.map((email) => email.label).join(" / ")} /></div><div className="glass-surface p-6 md:p-9"><h2 className="type-h2">Send a message</h2><p className="mb-8 mt-3 type-body">We’ll use these details only to understand your requirement.</p><EnquiryForm compact /></div></section><LocationMap /></> }
function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="border-t border-border pt-5"><div className="flex items-center gap-3 text-primary">{icon}<span className="eyebrow">{label}</span></div><p className="mt-3 whitespace-pre-line text-base leading-relaxed font-semibold">{value}</p></div> }

function LocationMap() {
  const [active, setActive] = useState(false);
  return (
    <section className="mx-auto site-container px-5 pb-24 lg:px-8">
      <p className="eyebrow">Visit us</p>
      <h2 className="mt-5 type-h2">Find our office &amp; works</h2>
      <p className="mt-3 max-w-2xl type-body">Located in Faridabad, Haryana.</p>
      <div className="relative mt-8 h-[380px] w-full overflow-hidden rounded-lg border border-border md:h-[450px] lg:h-[500px]">
        <iframe
          title="Handlair Engineering Technologies location map"
          src={MAP_EMBED_URL}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        {!active && (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label="Activate the map to pan and zoom"
            className="absolute inset-0 cursor-pointer md:hidden"
          >
            <span className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold text-foreground">
              Tap to move the map
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
