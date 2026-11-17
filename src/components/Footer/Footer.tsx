"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "../UI/Marquee";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Partner {
  name: string;
  logo: string | null;
}

const navKeys = [
  { key: "home" as const, href: "/" },
  { key: "competitions" as const, href: "/competitions" },
  { key: "gallery" as const, href: "/gallery" },
  { key: "team" as const, href: "/team" },
  { key: "horses" as const, href: "/horses" },
  { key: "tests" as const, href: "/tests" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
];

export default function Footer() {
  const { t } = useTranslation();
  const footerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [partnerLogos, setPartnerLogos] = useState<Partner[]>([
    { name: "Equestrian Co.", logo: null },
    { name: "Royal Stables", logo: null },
    { name: "Premium Feed", logo: null },
    { name: "Saddle Craft", logo: null },
    { name: "Arena Pro", logo: null },
  ]);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPartnerLogos(data.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;

    const tween = gsap.fromTo(
      footerRef.current.querySelectorAll(".reveal"),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) triggerRef.current = tween.scrollTrigger;

    return () => {
      if (triggerRef.current) triggerRef.current.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-primary/40 border-t border-white/5"
    >
      {/* Marquee banner */}
      <div className="py-6 border-b border-white/5 overflow-hidden">
        <Marquee
          items={[...t.footer.marquee]}
          separator="—"
          className="metallic text-2xl md:text-3xl tracking-[0.2em] uppercase font-extralight"
          speed={35}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Logo & description */}
          <div className="md:col-span-4 reveal">
            <h3 className="metallic text-3xl font-light tracking-[0.3em] uppercase mb-4">
              ECLIPSE
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              {t.footer.about}
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 reveal">
            <h4 className="text-accent text-xs tracking-[0.3em] uppercase mb-6">
              {t.footer.navigate}
            </h4>
            <nav className="flex flex-col gap-3">
              {navKeys.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-text-secondary text-sm hover:text-white transition-colors duration-300 tracking-wider"
                  data-cursor="view"
                >
                  {t.nav[link.key]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Socials */}
          <div className="md:col-span-2 reveal">
            <h4 className="text-accent text-xs tracking-[0.3em] uppercase mb-6">
              {t.footer.social}
            </h4>
            <nav className="flex flex-col gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-text-secondary text-sm hover:text-white transition-colors duration-300 tracking-wider"
                  data-cursor="view"
                >
                  {social.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Partner logos */}
        <div className="reveal mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partnerLogos.map((p) => (
              <div
                key={p.name}
                className="px-6 py-3 border border-accent/10 text-accent/30 text-xs tracking-[0.2em] uppercase"
              >
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-[30px] object-contain"
                  />
                ) : (
                  p.name
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="reveal mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary/40 text-xs tracking-wider">
            &copy; 2026 Eclipse Dressage Team. {t.footer.rights}
          </p>
          <p className="text-text-secondary/40 text-xs tracking-wider">
            {t.footer.designed}
          </p>
        </div>
      </div>
    </footer>
  );
}
