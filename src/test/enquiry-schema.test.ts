import { describe, expect, it } from "vitest";
import { enquirySchema } from "@/lib/enquiry-schema";

const valid = {
  firstName: "Ravi",
  email: "ravi@example.com",
  mobile: "9811164523",
  message: "Need a bag filter quote",
};

describe("enquiry rules", () => {
  it("accepts a complete enquiry", () => expect(enquirySchema.safeParse(valid).success).toBe(true));
  it("requires a requirement of at least 10 characters", () =>
    expect(enquirySchema.safeParse({ ...valid, message: "short" }).success).toBe(false));
  it("rejects an invalid email", () =>
    expect(enquirySchema.safeParse({ ...valid, email: "nope" }).success).toBe(false));
  it("rejects requirements over 5000 characters", () =>
    expect(enquirySchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false));
});
