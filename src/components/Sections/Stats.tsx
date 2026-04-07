"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stat {
  value: number;
  label: string;
}

const statKeys = ["stats_wins", "stats_competitions", "stats_years", "stats_horses"] as const;

const defaultStats: Stat[] = [
  { value: 47, label: "Victories" },
  { value: 156, label: "Competitions" },
  { value: 12, label: "Years" },
  { value: 24, label: "Horses" },
];

export default function Stats() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<Stat[]>(defaultStats);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStats(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !countersRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const counterEls = countersRef.current.querySelectorAll(".counter-value");

    counterEls.forEach((el, i) => {
      if (i >= stats.length) return;
      const target = stats[i].value;
      const obj = { val: 0 };

      const tween = gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString().padStart(2, "0");
        },
      });
      if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger);
    });

    const statItems = countersRef.current.querySelectorAll(".stat-item");
    const revealTween = gsap.fromTo(
      statItems,
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
    if (revealTween.scrollTrigger) triggersRef.current.push(revealTween.scrollTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [stats]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-primary/10 to-surface" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[15vw] font-extralight tracking-[0.2em] uppercase text-white/[0.02]">
          ECLIPSE
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">{t.sections.stats_label}</p>
          <h2 className="metallic text-5xl sm:text-6xl md:text-7xl font-extralight tracking-wider uppercase">
            {t.sections.stats_title}
          </h2>
        </div>

        <div ref={countersRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center group">
              <div className="metallic-bg w-12 h-[1px] mx-auto mb-8 opacity-30 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
              <div className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-wider">
                <span className="counter-value metallic">
                  {String(stat.value).padStart(2, "0")}
                </span>
              </div>
              <p className="text-text-secondary text-sm tracking-[0.3em] uppercase mt-4">
                {statKeys[i] ? t.sections[statKeys[i]] : stat.label}
              </p>
              <div className="metallic-bg w-12 h-[1px] mx-auto mt-8 opacity-30 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
