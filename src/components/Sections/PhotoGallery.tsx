"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaceholderImage from "../UI/PlaceholderImage";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryItem {
  caption: string;
  image: string | null;
}

const defaultGallery: GalleryItem[] = [
  { caption: "Vienna, 2024", image: null },
  { caption: "Amsterdam, 2023", image: null },
  { caption: "London, 2024", image: null },
  { caption: "Paris, 2023", image: null },
  { caption: "Berlin, 2024", image: null },
  { caption: "Stockholm, 2023", image: null },
  { caption: "Geneva, 2024", image: null },
  { caption: "Madrid, 2023", image: null },
];

const defaultQuotes = [
  "Precision is not perfection — it is intention made visible.",
  "Every stride tells a story of trust between horse and rider.",
];

const quoteAfterIndex = [1, 4];

export default function PhotoGallery() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [quotes, setQuotes] = useState<string[]>(defaultQuotes);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.gallery) setGallery(data.gallery);
        if (data?.galleryQuotes) setQuotes(data.galleryQuotes);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Kill previous if re-running (gallery data changed)
    if (triggerRef.current) triggerRef.current.kill();
    if (tweenRef.current) tweenRef.current.kill();

    const track = trackRef.current;

    // Need a small delay for DOM to settle after data load
    const timer = setTimeout(() => {
      const totalWidth = track.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;

      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tweenRef.current = tween;
      if (tween.scrollTrigger) triggerRef.current = tween.scrollTrigger;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (triggerRef.current) triggerRef.current.kill();
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [gallery]);

  let quoteIdx = 0;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-surface" data-cursor="drag">
      <div className="absolute top-8 left-6 md:left-12 z-10">
        <p className="text-accent text-sm tracking-[0.3em] uppercase">
          {t.sections.gallery}
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex items-center gap-8 md:gap-12 h-screen px-[10vw]"
      >
        {gallery.map((item, i) => {
          const showQuote =
            quoteAfterIndex.includes(i) && quoteIdx < quotes.length;
          const currentQuote = showQuote ? quotes[quoteIdx++] : null;

          return (
            <div
              key={i}
              className="flex items-center gap-8 md:gap-12 shrink-0"
            >
              <div className="shrink-0 group">
                <div
                  className="overflow-hidden rounded-sm"
                  style={{ width: "500px", height: "380px" }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderImage
                      label={`Photo ${i + 1}`}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="text-text-secondary text-sm mt-4 tracking-widest uppercase">
                  {item.caption}
                </p>
              </div>
              {currentQuote && (
                <div className="shrink-0 max-w-[300px] px-4">
                  <p className="text-xl md:text-2xl font-extralight text-white/60 italic leading-relaxed">
                    &ldquo;{currentQuote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-3 text-text-secondary/40 text-xs tracking-widest uppercase">
          <div className="w-12 h-[1px] bg-accent/30" />
          <span>{t.sections.scroll}</span>
          <div className="w-12 h-[1px] bg-accent/30" />
        </div>
      </div>
    </section>
  );
}
