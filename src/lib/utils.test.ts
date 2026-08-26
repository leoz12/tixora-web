import { cn, formatPrice } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting tailwind classes to the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false, undefined, null, "py-1")).toBe("px-2 py-1");
  });
});

describe("formatPrice", () => {
  it("formats a price with the Rp prefix and Indonesian thousands separators", () => {
    expect(formatPrice(150000)).toBe("Rp 150.000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("Rp 0");
  });
});
