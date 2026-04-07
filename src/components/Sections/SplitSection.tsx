"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaceholderImage from "../UI/PlaceholderImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SplitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tween = gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) triggerRef.current = tween.scrollTrigger;

    return () => {
      if (triggerRef.current) triggerRef.current.kill();
    };
  }, []);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    if (hoveredSide === "left") {
      gsap.to(left, { flex: 1.5, duration: 0.6, ease: "power2.out" });
      gsap.to(right, { flex: 0.5, duration: 0.6, ease: "power2.out" });
    } else if (hoveredSide === "right") {
      gsap.to(left, { flex: 0.5, duration: 0.6, ease: "power2.out" });
      gsap.to(right, { flex: 1.5, duration: 0.6, ease: "power2.out" });
    } else {
      gsap.to(left, { flex: 1, duration: 0.6, ease: "power2.out" });
      gsap.to(right, { flex: 1, duration: 0.6, ease: "power2.out" });
    }
  }, [hoveredSide]);

  return (
    <section ref={sectionRef} className="relative h-screen flex overflow-hidden">
      {/* Left panel — Competitions */}
      <div
        ref={leftRef}
        className="split-panel relative flex-1 overflow-hidden group"
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
        data-cursor="explore"
      >
        <PlaceholderImage
          label="Competition Photo"
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/40 transition-colors duration-500" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">Explore</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wider uppercase text-white">
            Competitions
          </h2>
          <div className="metallic-bg w-16 h-[1px] mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      <div className="w-[1px] bg-accent/20 z-10" />

      {/* Right panel — Behind the Scenes */}
      <div
        ref={rightRef}
        className="split-panel relative flex-1 overflow-hidden group"
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
        data-cursor="explore"
      >
        <PlaceholderImage
          label="Behind the Scenes Photo"
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-secondary/60 group-hover:bg-secondary/40 transition-colors duration-500" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">Explore</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wider uppercase text-white">
            Behind the Scenes
          </h2>
          <div className="metallic-bg w-16 h-[1px] mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </section>
  );
}
