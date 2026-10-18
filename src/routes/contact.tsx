import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageHero } from "@/components/site-shell";
import { contact } from "@/data/handlair";

export const Route = createFileRoute("/contact")({ head: () => ({ meta: [
  { title: "Contact Handlair — Industrial Air Systems" }, { name: "description", content: "Contact Handlair for air handling and industrial air pollution control equipment." }, { property: "og:title", content: "Contact Handlair" }, { property: "og:description", content: "Discuss your industrial air handling requirements." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: ContactPage });

function ContactPage() { return <><PageHero eyebrow="Contact" title="Talk to our team."><p>Share your requirements or contact Handlair directly for product and system enquiries.</p></PageHero><section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[.7fr_1.3fr] lg:px-8"><div className="space-y-8"><ContactItem icon={<MapPin />} label="Address" value={contact.address} /><ContactItem icon={<Phone />} label="Phone" value={`${contact.phone}\n${contact.mobiles}`} /><ContactItem icon={<Mail />} label="Email" value={contact.emails} /></div><div className="glass-surface p-6 md:p-9"><h2 className="type-h2">Send a message</h2><p className="mb-8 mt-3 type-body">We’ll use these details only to understand your requirement.</p><EnquiryForm compact /></div></section></> }
function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="border-t border-border pt-5"><div className="flex items-center gap-3 text-primary">{icon}<span className="eyebrow">{label}</span></div><p className="mt-3 whitespace-pre-line text-base leading-relaxed font-semibold">{value}</p></div> }