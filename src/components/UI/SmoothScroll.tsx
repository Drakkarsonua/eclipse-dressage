"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll() {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // Expose globally so Hero can call stop/start
      (window as any).__lenis = lenis;

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      const rafCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);

      lenisRef.current = { lenis, rafCallback };
    });

    return () => {
      cancelled = true;
      if (lenisRef.current) {
        gsap.ticker.remove(lenisRef.current.rafCallback);
        lenisRef.current.lenis.destroy();
        (window as any).__lenis = null;
        lenisRef.current = null;
      }
    };
  }, []);

  return null;
}
