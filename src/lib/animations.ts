import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/**
 * Fade-in + slide-up animation triggered on scroll
 */
export function scrollReveal(
  element: string | Element | Element[],
  options?: {
    trigger?: string | Element;
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
  }
) {
  const {
    trigger,
    y = 50,
    duration = 0.8,
    stagger = 0.15,
    delay = 0,
    start = "top 75%",
  } = options || {};

  return gsap.fromTo(
    element,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger || (element as Element),
        start,
        toggleActions: "play none none reverse",
      },
    }
  );
}

/**
 * Smooth scroll to a target element
 */
export function smoothScrollTo(target: string | Element, duration = 1.5) {
  gsap.to(window, {
    duration,
    scrollTo: { y: target, offsetY: 0 },
    ease: "power3.inOut",
  });
}

/**
 * Parallax effect on an element
 */
export function parallax(
  element: string | Element,
  options?: {
    trigger?: string | Element;
    yPercent?: number;
    start?: string;
    end?: string;
  }
) {
  const {
    trigger,
    yPercent = -20,
    start = "top bottom",
    end = "bottom top",
  } = options || {};

  return gsap.to(element, {
    yPercent,
    ease: "none",
    scrollTrigger: {
      trigger: trigger || (element as Element),
      start,
      end,
      scrub: 1,
    },
  });
}

/**
 * Stagger reveal for child elements
 */
export function staggerReveal(
  parent: string | Element,
  childSelector: string,
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  }
) {
  const {
    y = 40,
    duration = 0.8,
    stagger = 0.1,
    start = "top 70%",
  } = options || {};

  const parentEl =
    typeof parent === "string" ? document.querySelector(parent) : parent;
  if (!parentEl) return;

  const children = parentEl.querySelectorAll(childSelector);

  return gsap.fromTo(
    children,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: parentEl,
        start,
        toggleActions: "play none none reverse",
      },
    }
  );
}

/**
 * Kill all ScrollTrigger instances — call on unmount
 */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
