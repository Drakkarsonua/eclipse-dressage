"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { categories, tests, isAvailable, type TestItem } from "@/lib/tests-data";

function TestRow({ test, index, lang }: { test: TestItem; index: number; lang: string }) {
  const { t } = useTranslation();
  const available = isAvailable(test.slug);

  const content = (
    <>
      <div className="shrink-0 w-10 h-12 flex items-center justify-center border border-accent/20 rounded-sm bg-accent/5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent/60">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-light tracking-wide transition-colors ${available ? "text-white/90 group-hover:text-white" : "text-white/30"}`}>
          {lang === "ua" ? test.name.ua : test.name.en}
        </h3>
        {!available && (
          <p className="text-accent/30 text-xs tracking-wider mt-0.5">{t.pages.pdf_unavailable}</p>
        )}
      </div>
      <div className={`shrink-0 flex items-center gap-2 transition-colors ${available ? "text-accent/60 group-hover:text-accent" : "text-white/10"}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </>
  );

  if (!available) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
        className="flex items-center gap-4 md:gap-6 p-4 md:p-5 border border-white/[0.04] rounded-sm bg-white/[0.01] opacity-50 cursor-not-allowed"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={`/tests/${test.slug}`}
        className="group flex items-center gap-4 md:gap-6 p-4 md:p-5 border border-white/[0.08] rounded-sm bg-white/[0.02] hover:border-accent/30 hover:bg-white/[0.04] transition-all duration-300"
      >
        {content}
      </Link>
    </motion.div>
  );
}

export default function TestsPage() {
  const { t, lang } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? tests
    : tests.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary text-sm tracking-wider hover:text-white transition-colors mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t.pages.home}
        </Link>

        {/* Header */}
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          {t.pages.tests_label}
        </p>
        <h1 className="metallic text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-4">
          {t.pages.tests_title}
        </h1>
        <p className="text-text-secondary text-sm tracking-wider max-w-xl mb-12">
          {t.pages.tests_description}
        </p>

        {/* Category tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              const count = cat.key === "all"
                ? tests.length
                : tests.filter((t) => t.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`relative px-4 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm border transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "border-accent/50 text-white bg-accent/10"
                      : "border-white/[0.08] text-text-secondary/60 hover:border-white/20 hover:text-text-secondary"
                  }`}
                >
                  {lang === "ua" ? cat.name.ua : cat.name.en}
                  <span className={`ml-2 text-[10px] ${isActive ? "text-accent" : "text-white/20"}`}>
                    {count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-[1px] left-3 right-3 h-[1px] bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Test list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {filtered.map((test, i) => (
              <TestRow key={test.slug} test={test} index={i} lang={lang} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
