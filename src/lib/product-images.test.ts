import { describe, expect, it } from "vitest";
import { featuredFirst } from "./product-images";

const id = (s: string) => s;

describe("featuredFirst", () => {
  it("moves the featured photo first and keeps the rest in saved order", () => {
    expect(featuredFirst(["a", "b", "c", "d"], "c", id)).toEqual(["c", "a", "b", "d"]);
  });
  it("shows the featured photo only once", () => {
    expect(featuredFirst(["a", "b"], "b", id)).toHaveLength(2);
  });
  it("keeps saved order when the featured photo is missing", () => {
    expect(featuredFirst(["a", "b"], "z", id)).toEqual(["a", "b"]);
    expect(featuredFirst(["a", "b"], "", id)).toEqual(["a", "b"]);
  });
});
