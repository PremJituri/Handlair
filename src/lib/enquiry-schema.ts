import { z } from "zod";

const optional = (max: number) => z.string().trim().max(max).optional().default("");

export const enquirySchema = z.object({
  firstName: z.string().trim().min(2, "Please enter your first name").max(100),
  lastName: optional(100),
  company: optional(150),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile: z
    .string()
    .trim()
    .min(7, "Enter a valid mobile number")
    .max(30, "Enter a valid mobile number"),
  city: optional(100),
  country: optional(100),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more")
    .max(5000, "Please keep this under 5000 characters"),
  website: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
