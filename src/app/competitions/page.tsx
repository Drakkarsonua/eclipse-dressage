"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  displayDate: string;
  location: string;
  tags: string[];
  status: "live" | "upcoming";
}

export default function CompetitionsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary text-sm tracking-wider hover:text-white transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t.pages.home}
        </Link>

        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          {t.pages.competitions_label}
        </p>
        <h1 className="metallic text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-4">
          {t.pages.competitions_title}
        </h1>
        <p className="text-text-secondary text-sm tracking-wider max-w-xl">
          {t.pages.competitions_description}
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex items-center gap-3 text-text-secondary">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-sm tracking-wider">{t.sections.loading}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-text-secondary mb-4">{t.pages.failed_load}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-accent/30 text-sm text-accent hover:bg-accent/10 transition"
            >
              {t.pages.retry}
            </button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-32">
            <p className="text-text-secondary">{t.pages.no_upcoming}</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event, i) => (
              <EventCard key={`${event.startDate}-${i}`} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: CalendarEvent; index: number }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
      className="group relative border border-white/5 rounded-sm bg-white/[0.02] hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 via-transparent to-secondary-light/10" />
      </div>

      <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="shrink-0 md:w-48">
          <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent/30" />
                <span className="text-accent/60 text-xs tracking-wider uppercase">
                  {t.pages.upcoming_status}
                </span>
              </div>
            )}
          </div>
          <p className="text-text-secondary text-sm mt-2 tracking-wider">
            {event.displayDate}
          </p>
        </div>

        <div className="hidden md:block w-[1px] h-12 bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-light tracking-wide text-white/90 group-hover:text-white transition-colors leading-snug">
            {event.title}
          </h3>
          <div className="flex items-start gap-2 mt-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent/40 mt-0.5 shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p className="text-text-secondary text-sm leading-relaxed">
              {event.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {event.tags
            .filter((tag) => tag !== "Українські")
            .map((tag) => (
              <span
                key={tag}
                className={`px-2.5 py-1 text-[10px] tracking-wider uppercase rounded-sm border ${
                  tag === "Виїздка"
                    ? "border-accent/30 text-accent bg-accent/5"
                    : "border-white/10 text-text-secondary/60"
                }`}
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
