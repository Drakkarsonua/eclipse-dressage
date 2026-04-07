"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import PlaceholderImage from "../UI/PlaceholderImage";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Horse {
  name: string;
  year: string;
  image: string | null;
  actionImage: string | null;
}

const defaultHorses: Horse[] = [
  { name: "Aristocrat", year: "2018", image: null, actionImage: null },
  { name: "Shadow Prince", year: "2019", image: null, actionImage: null },
  { name: "Royal Storm", year: "2020", image: null, actionImage: null },
  { name: "Golden Whisper", year: "2021", image: null, actionImage: null },
  { name: "Midnight Star", year: "2022", image: null, actionImage: null },
  { name: "Silver Knight", year: "2023", image: null, actionImage: null },
  { name: "Noble Spirit", year: "2024", image: null, actionImage: null },
  { name: "Dark Ember", year: "2025", image: null, actionImage: null },
];

export default function HorsesCarousel() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [horses, setHorses] = useState<Horse[]>(defaultHorses);

  useEffect(() => {
    fetch("/api/horses")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setHorses(data); })
      .catch(() => {});
  }, []);

  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const tween = gsap.fromTo(
      titleRef.current.querySelectorAll(".reveal"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) triggerRef.current = tween.scrollTrigger;

    return () => {
      if (triggerRef.current) triggerRef.current.kill();
    };
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === "right" ? 400 : -400,
      behavior: "smooth",
    });
  };

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-surface">
      <div ref={titleRef} className="px-6 md:px-12 mb-16">
        <p className="reveal text-accent text-sm tracking-[0.3em] uppercase mb-4">{t.sections.horses_label}</p>
        <div className="reveal flex items-end justify-between">
          <h2 className="metallic text-5xl sm:text-6xl md:text-7xl font-extralight tracking-wider uppercase">
            {t.sections.horses_title}
          </h2>
          <div className="hidden md:flex gap-3">
            <button onClick={() => scrollCarousel("left")} className="w-12 h-12 border border-accent/30 flex items-center justify-center hover:bg-accent/10 transition-colors" data-cursor="view">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={() => scrollCarousel("right")} className="w-12 h-12 border border-accent/30 flex items-center justify-center hover:bg-accent/10 transition-colors" data-cursor="view">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

        <div ref={carouselRef} className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {horses.map((horse, i) => (
            <motion.div
              key={`${horse.name}-${i}`}
              className="shrink-0 w-[300px] md:w-[350px] group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              data-cursor="explore"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-900">
                {/* Default state */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredIndex === i ? "opacity-0" : "opacity-100"}`}>
                  {horse.image ? (
                    <img src={horse.image} alt={horse.name} className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage label={horse.name} className="h-full" />
                  )}
                </div>
                {/* Hover state */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredIndex === i ? "opacity-100" : "opacity-0"}`}>
                  {horse.actionImage ? (
                    <img src={horse.actionImage} alt={`${horse.name} action`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center">
                      <div className="text-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent mx-auto mb-4">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-accent/60 text-xs tracking-widest uppercase">Action shot</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-surface/90 to-transparent" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-lg font-light tracking-wider uppercase text-white group-hover:metallic transition-all duration-300">
                  {horse.name}
                </h3>
                <span className="text-accent text-sm">{horse.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
