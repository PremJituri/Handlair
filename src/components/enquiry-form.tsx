import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryInput } from "@/lib/enquiry-schema";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { Button } from "@/components/ui/button";
import { Magnetic, MagneticLabel } from "@/components/core/magnetic";
import { CheckCircle2 } from "lucide-react";

type FormData = EnquiryInput;

const springOptions = { bounce: 0.1 };

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(enquirySchema) });
  if (sent)
    return (
      <div className="border border-primary bg-secondary p-8">
        <CheckCircle2 className="size-9 text-primary" />
        <h2 className="mt-5 type-h3">Enquiry sent</h2>
        <p className="mt-2 type-body">
          Thank you. Our team will get back to you shortly. For urgent requirements, call
          0129-2229101.
        </p>
      </div>
    );
  const field =
    "w-full rounded-lg border border-input bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setFailure("");
        try {
          const result = await submitEnquiry({ data: values });
          if (result.ok) setSent(true);
          else
            setFailure(
              result.reason === "rate_limited"
                ? "Too many enquiries sent. Please try again in 15 minutes, or email sales@handlair.co.in."
                : "We could not send your enquiry. Please try again or email sales@handlair.co.in.",
            );
        } catch {
          setFailure(
            "We could not send your enquiry. Please try again or email sales@handlair.co.in.",
          );
        }
      })}
      className="grid gap-5 sm:grid-cols-2"
      noValidate
    >
      <Field label="First name" error={errors.firstName?.message}>
        <input className={field} {...register("firstName")} />
      </Field>
      <Field label="Last name" error={errors.lastName?.message}>
        <input className={field} {...register("lastName")} />
      </Field>
      <Field label="Company" error={errors.company?.message}>
        <input className={field} {...register("company")} />
      </Field>
      <Field label="Mobile" error={errors.mobile?.message}>
        <input className={field} type="tel" {...register("mobile")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input className={field} type="email" {...register("email")} />
      </Field>
      {!compact && (
        <Field label="City" error={errors.city?.message}>
          <input className={field} {...register("city")} />
        </Field>
      )}
      {!compact && (
        <Field label="Country" error={errors.country?.message}>
          <input className={field} {...register("country")} />
        </Field>
      )}
      <div className="sm:col-span-2">
        <Field label="Requirement" error={errors.message?.message}>
          <textarea rows={5} className={field} {...register("message")} />
        </Field>
      </div>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />
      {failure && (
        <p role="alert" className="sm:col-span-2 text-destructive">
          {failure}
        </p>
      )}
      <div className="sm:col-span-2">
        <Magnetic intensity={0.2} springOptions={springOptions} actionArea="global" range={200}>
          <Button type="submit" size="xl" disabled={isSubmitting} className="rounded-lg">
            <MagneticLabel>{isSubmitting ? "Sending…" : "Submit enquiry"}</MagneticLabel>
          </Button>
        </Magnetic>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-base leading-relaxed font-semibold">
      <span>{label}</span>
      {children}
      {error && <span className="text-sm text-destructive">{error}</span>}
    </label>
  );
}
