import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync("src/styles.css", "utf8");
const adminShell = readFileSync("src/components/admin/admin-shell.tsx", "utf8");
const siteShell = readFileSync("src/components/site-shell.tsx", "utf8");

const containerRule = styles.match(/@utility site-container \{([^}]*)\}/)?.[1] ?? "";

describe("shared container width", () => {
  it("fills the available width so admin pages cannot shrink-wrap into a narrow column", () => {
    expect(containerRule).toContain("width: 100%");
    expect(containerRule).toContain("max-width: var(--site-content-width)");
  });

  it("keeps the admin dashboard root explicitly full width", () => {
    expect(adminShell).toContain("mx-auto w-full site-container");
  });
});

describe("floating navigation width", () => {
  it("sizes the header by width instead of side margins, so it never overflows the viewport", () => {
    const header = siteShell.match(/<header className="([^"]*)"/)?.[1] ?? "";
    expect(header).toContain("w-[calc(100%-1.5rem)]");
    expect(header).toContain("sm:w-[calc(100%-2.5rem)]");
    expect(header).toContain("lg:w-[calc(100%-4rem)]");
    expect(header).not.toMatch(/(^|\s)(sm:|lg:|xl:)?mx-(?!auto)/);
  });
});
