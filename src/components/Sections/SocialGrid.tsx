"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaceholderImage from "../UI/PlaceholderImage";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const socialPosts = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
}));

const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

export default function SocialGrid() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const t1 = gsap.fromTo(
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
    if (t1.scrollTrigger) triggersRef.current.push(t1.scrollTrigger);

    const t2 = gsap.fromTo(
      sectionRef.current.querySelectorAll(".grid-item"),
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
    if (t2.scrollTrigger) triggersRef.current.push(t2.scrollTrigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-12 bg-surface">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="reveal text-accent text-sm tracking-[0.3em] uppercase mb-4">
          {t.sections.social_label}
        </p>
        <h2 className="reveal metallic text-5xl sm:text-6xl md:text-7xl font-extralight tracking-wider uppercase">
          {t.sections.social_title}
        </h2>
      </div>

      {/* Social links */}
      <div className="reveal flex justify-center gap-6 mb-16">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            className="flex items-center gap-2 px-4 py-2 border border-accent/20 text-text-secondary hover:text-white hover:border-accent/50 transition-all duration-300"
            data-cursor="view"
          >
            {social.icon}
            <span className="text-sm tracking-widest uppercase hidden sm:inline">
              {social.name}
            </span>
          </a>
        ))}
      </div>

      {/* Photo grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {socialPosts.map((post) => (
          <div
            key={post.id}
            className="grid-item aspect-square overflow-hidden rounded-sm group"
            data-cursor="explore"
          >
            <PlaceholderImage
              label={`Post ${post.id}`}
              className="transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
