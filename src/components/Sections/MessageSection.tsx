"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MessageSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
  const [author, setAuthor] = useState("");
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.message) {
          setQuote(data.message.quote);
          setAuthor(data.message.author);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !quoteRef.current) return;

    const elements = quoteRef.current.querySelectorAll(".reveal");

    const tween = gsap.fromTo(
      elements,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
    if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger);

    const sig = quoteRef.current.querySelector(".signature");
    if (sig) {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        animation: gsap.to(sig, { y: -30 }),
      });
      triggersRef.current.push(st);
    }

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section
      id="message-section"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 md:px-12"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-primary/20 to-surface" />
      <div className="absolute left-1/2 top-0 w-[1px] h-32 bg-gradient-to-b from-transparent to-accent/20" />

      <div ref={quoteRef} className="relative max-w-4xl mx-auto text-center">
        <div className="reveal metallic text-8xl md:text-9xl font-serif leading-none mb-8 opacity-30">
          &ldquo;
        </div>
        <p className="reveal text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight leading-relaxed text-white/90 tracking-wide">
          {quote}
        </p>
        <div className="reveal flex justify-center my-12">
          <div className="metallic-bg w-24 h-[1px]" />
        </div>
        <div className="reveal signature">
          <svg
            width="200"
            height="60"
            viewBox="0 0 200 60"
            className="mx-auto"
          >
            <path
              d="M10 40 C30 10, 50 50, 70 30 S110 10, 130 35 S160 50, 190 20"
              fill="none"
              stroke="#8A8D90"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M60 45 C70 42, 80 48, 100 43"
              fill="none"
              stroke="#8A8D90"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-text-secondary text-sm tracking-[0.3em] uppercase mt-4">
            {author || t.sections.founder}
          </p>
        </div>
      </div>
    </section>
  );
}
