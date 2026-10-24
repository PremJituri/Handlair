import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { heroSlides } from "@/data/hero-slideshow";

afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Hero slideshow", () => {
  it("advances every 3000 ms through all ten supplied images in order and loops", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "Image").mockImplementation(function () {
      return { src: "", decode: () => Promise.resolve() } as unknown as HTMLImageElement;
    });
    const { container, unmount } = render(<HeroSlideshow />);
    await act(async () => { await Promise.resolve(); });
    const currentSrc = () => container.querySelector('img[aria-hidden="false"]')?.getAttribute("src");
    expect(heroSlides).toHaveLength(10);
    expect(currentSrc()).toBe(heroSlides[0].src);
    act(() => vi.advanceTimersByTime(2999));
    expect(currentSrc()).toBe(heroSlides[0].src);
    act(() => vi.advanceTimersByTime(1));
    expect(currentSrc()).toBe(heroSlides[1].src);
    for (const slide of heroSlides.slice(2)) {
      act(() => vi.advanceTimersByTime(3000));
      expect(currentSrc()).toBe(slide.src);
    }
    act(() => vi.advanceTimersByTime(3000));
    expect(currentSrc()).toBe(heroSlides[0].src);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not autoplay when reduced motion is enabled", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    vi.spyOn(window, "Image").mockImplementation(function () {
      return { src: "", decode: () => Promise.resolve() } as unknown as HTMLImageElement;
    });
    const { container } = render(<HeroSlideshow />);
    await act(async () => { await Promise.resolve(); });
    act(() => vi.advanceTimersByTime(30000));
    expect(container.querySelector('img[aria-hidden="false"]')?.getAttribute("src")).toBe(heroSlides[0].src);
    expect(vi.getTimerCount()).toBe(0);
  });
});