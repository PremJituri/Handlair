import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({ firstName: z.string().min(2, "Please enter your first name"), lastName: z.string().optional(), company: z.string().optional(), email: z.string().email("Enter a valid email"), mobile: z.string().min(7, "Enter a valid mobile number"), city: z.string().optional(), country: z.string().optional(), message: z.string().min(10, "Please tell us a little more") });
type FormData = z.infer<typeof schema>;

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  if (sent) return <div className="border border-primary bg-secondary p-8"><CheckCircle2 className="size-9 text-primary" /><h2 className="mt-5 font-display text-2xl uppercase">Enquiry prepared</h2><p className="mt-2 text-muted-foreground">Thank you. Email delivery is not connected in this preview; please contact sales@handlair.co.in.</p></div>;
  const field = "w-full border border-input bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  return <form onSubmit={handleSubmit(async () => { await new Promise((r) => setTimeout(r, 500)); setSent(true); })} className="grid gap-5 sm:grid-cols-2" noValidate>
    <Field label="First name" error={errors.firstName?.message}><input className={field} {...register("firstName")} /></Field>
    <Field label="Last name" error={errors.lastName?.message}><input className={field} {...register("lastName")} /></Field>
    <Field label="Company" error={errors.company?.message}><input className={field} {...register("company")} /></Field>
    <Field label="Mobile" error={errors.mobile?.message}><input className={field} type="tel" {...register("mobile")} /></Field>
    <Field label="Email" error={errors.email?.message}><input className={field} type="email" {...register("email")} /></Field>
    {!compact && <Field label="City" error={errors.city?.message}><input className={field} {...register("city")} /></Field>}
    {!compact && <Field label="Country" error={errors.country?.message}><input className={field} {...register("country")} /></Field>}
    <div className="sm:col-span-2"><Field label="Requirement" error={errors.message?.message}><textarea rows={5} className={field} {...register("message")} /></Field></div>
    <div className="sm:col-span-2"><Button type="submit" size="xl" disabled={isSubmitting}>{isSubmitting ? "Preparing…" : "Submit enquiry"}</Button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error: string | undefined; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-semibold"><span>{label}</span>{children}{error && <span className="text-xs text-destructive">{error}</span>}</label>; }