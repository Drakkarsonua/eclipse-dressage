"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Partner {
  name: string;
  logo: string | null;
}

const defaultPartners: Partner[] = [
  { name: "Equestrian Co.", logo: null },
  { name: "Royal Stables", logo: null },
  { name: "Premium Feed", logo: null },
  { name: "Saddle Craft", logo: null },
  { name: "Arena Pro", logo: null },
  { name: "Horse Health", logo: null },
  { name: "Bridle & Bit", logo: null },
  { name: "Stirrup Works", logo: null },
  { name: "Dressage Wear", logo: null },
  { name: "Paddock Prime", logo: null },
];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div
      className="shrink-0 mx-4 flex items-center justify-center w-[200px] h-[80px] border border-accent/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300"
      data-cursor="view"
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-[50px] max-w-[160px] object-contain"
        />
      ) : (
        <span className="text-accent/50 text-xs tracking-[0.2em] uppercase">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export default function Partners() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState<Partner[]>(defaultPartners);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPartners(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tween = gsap.fromTo(
      sectionRef.current.querySelectorAll(".reveal"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
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

  const row1 = [...partners, ...partners];
  const row2 = [...partners.slice(5), ...partners, ...partners.slice(0, 5)];

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-surface">
      <div className="text-center mb-16 px-6">
        <p className="reveal text-accent text-sm tracking-[0.3em] uppercase mb-4">
          {t.sections.partners_label}
        </p>
        <h2 className="reveal metallic text-5xl sm:text-6xl md:text-7xl font-extralight tracking-wider uppercase">
          {t.sections.partners_title}
        </h2>
      </div>

      <div className="reveal mb-8">
        <div
          className="flex animate-marquee"
          style={{ animationDuration: "40s" }}
        >
          {row1.map((p, i) => (
            <PartnerCard key={`r1-${i}`} partner={p} />
          ))}
        </div>
      </div>

      <div className="reveal">
        <div
          className="flex animate-marquee-reverse"
          style={{ animationDuration: "35s" }}
        >
          {row2.map((p, i) => (
            <PartnerCard key={`r2-${i}`} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
