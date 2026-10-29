import { describe, expect, it } from "vitest";
import { footerNav } from "@/components/site-shell";
import { contact } from "@/data/handlair";

describe("Footer contact details", () => {
  it("links every public page in the Navigate list", () => {
    expect(footerNav.map(([, to]) => to)).toEqual([
      "/",
      "/about",
      "/products",
      "/contact",
      "/enquiry",
    ]);
  });

  it("uses the verified landline and mobile numbers as tel links", () => {
    expect(contact.phone).toBe("0129-2229101");
    expect(contact.phoneHref).toBe("tel:01292229101");
    expect(contact.mobiles).toEqual([
      { label: "+91-9811164523", href: "tel:+919811164523" },
      { label: "9910494523", href: "tel:+919910494523" },
    ]);
  });

  it("lists both verified emails as mailto links", () => {
    expect(contact.emails).toEqual([
      { label: "sales@handlair.co.in", href: "mailto:sales@handlair.co.in" },
      { label: "handlairdelhi@gmail.com", href: "mailto:handlairdelhi@gmail.com" },
    ]);
  });

  it("shows the company name and works address", () => {
    expect(contact.company).toBe("Handlair Engineering Technologies");
    expect(contact.address).toBe(
      "Indira Industrial Complex, Jeevan Nagar, Wazirpur Road, Old Faridabad, Haryana – 121002",
    );
  });
});
