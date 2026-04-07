"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  displayDate: string;
  location: string;
  tags: string[];
  status: "live" | "upcoming";
}

function formatDateBlock(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
  return { day: String(day).padStart(2, "0"), month };
}

export default function UpcomingEvents() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !cardsRef.current || !sectionRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".event-card");
    if (cards.length === 0) return;

    const tween = gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
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
  }, [loading, events]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-12 bg-surface">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
            {t.sections.upcoming_label}
          </p>
          <h2 className="metallic text-5xl sm:text-6xl md:text-7xl font-extralight tracking-wider uppercase">
            {t.sections.upcoming}
          </h2>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="space-y-4">
          {loading && (
            <div className="flex items-center gap-3 text-text-secondary py-16 justify-center">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm tracking-wider">{t.sections.loading}</span>
            </div>
          )}

          {!loading && events.length === 0 && (
            <p className="text-text-secondary text-center py-16">
              {t.sections.no_events}
            </p>
          )}

          {!loading &&
            events.map((event, i) => {
              const { day, month } = formatDateBlock(event.startDate);
              return (
                <div
                  key={`${event.startDate}-${i}`}
                  className="event-card group relative border border-white/[0.08] rounded-sm bg-white/[0.02] hover:border-accent/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 via-transparent to-secondary-light/10" />
                  </div>

                  <div className="relative flex items-center gap-6 md:gap-8 p-5 md:p-6">
                    {/* Date block */}
                    <div className="shrink-0 w-16 md:w-20 text-center">
                      <div className="text-3xl md:text-4xl font-extralight text-white leading-none">
                        {day}
                      </div>
                      <div className="text-accent text-xs tracking-[0.2em] uppercase mt-1">
                        {month}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-[1px] h-12 bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-light tracking-wide text-white/90 group-hover:text-white transition-colors leading-snug truncate">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-accent/40 shrink-0"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <p className="text-text-secondary text-sm truncate">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      {event.status === "live" ? (
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                          </span>
                          <span className="text-green-400 text-xs font-medium tracking-wider uppercase">
                            {t.pages.live}
                          </span>
                        </div>
                      ) : (
                        <span className="text-accent/60 text-xs tracking-wider uppercase">
                          {t.pages.upcoming_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/competitions"
            className="inline-flex items-center gap-3 px-8 py-3 border border-accent/30 text-sm text-accent hover:text-white hover:border-accent/60 tracking-[0.2em] uppercase transition-all duration-300"
          >
            {t.sections.view_calendar}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
