import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { heroSlides } from "@/data/hero-slideshow";
import { optimizedPhotoUrl } from "@/data/image-renditions";

const advance = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Hero slideshow", () => {
  it("keeps a single supplied photo static without scheduling a timer", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "Image").mockImplementation(function () {
      return { src: "", decode: () => Promise.resolve() } as unknown as HTMLImageElement;
    });
    const { container } = render(
      <HeroSlideshow slides={[{ src: "/one.jpg", alt: "One photo" }]} />,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(vi.getTimerCount()).toBe(0);
    await advance(18000);
    expect(container.querySelector('img[aria-hidden="false"]')?.getAttribute("src")).toBe(
      "/one.jpg",
    );
  });

  it("advances every 6000 ms through all ten supplied images in order and loops", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "Image").mockImplementation(function () {
      return { src: "", decode: () => Promise.resolve() } as unknown as HTMLImageElement;
    });
    const { container, unmount } = render(<HeroSlideshow />);
    await act(async () => {
      await Promise.resolve();
    });
    const currentSrc = () =>
      container.querySelector('img[aria-hidden="false"]')?.getAttribute("src");
    expect(heroSlides).toHaveLength(10);
    expect(currentSrc()).toBe(optimizedPhotoUrl(heroSlides[0].src));
    await advance(5999);
    expect(currentSrc()).toBe(optimizedPhotoUrl(heroSlides[0].src));
    await advance(1);
    expect(currentSrc()).toBe(optimizedPhotoUrl(heroSlides[1].src));
    for (const slide of heroSlides.slice(2)) {
      await advance(6000);
      expect(currentSrc()).toBe(optimizedPhotoUrl(slide.src));
    }
    await advance(6000);
    expect(currentSrc()).toBe(optimizedPhotoUrl(heroSlides[0].src));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not autoplay when reduced motion is enabled", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    vi.spyOn(window, "Image").mockImplementation(function () {
      return { src: "", decode: () => Promise.resolve() } as unknown as HTMLImageElement;
    });
    const { container } = render(<HeroSlideshow />);
    await act(async () => {
      await Promise.resolve();
    });
    await advance(30000);
    expect(container.querySelector('img[aria-hidden="false"]')?.getAttribute("src")).toBe(
      optimizedPhotoUrl(heroSlides[0].src),
    );
    expect(vi.getTimerCount()).toBe(0);
    // Reduced motion only fetches and renders the displayed photo.
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(window.Image).toHaveBeenCalledTimes(1);
  });
});
