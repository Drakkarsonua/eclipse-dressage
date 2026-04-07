"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { getTestBySlug, isAvailable } from "@/lib/tests-data";

export default function TestViewerPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useTranslation();
  const test = getTestBySlug(slug);
  const available = test ? isAvailable(test.slug) : false;

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  const zoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">404</p>
        <h1 className="metallic text-4xl md:text-6xl font-extralight tracking-[0.2em] uppercase mb-8">
          {t.pages.test_not_found}
        </h1>
        <Link
          href="/tests"
          className="px-8 py-3 border border-accent/40 text-text-secondary text-sm tracking-[0.3em] uppercase hover:border-accent hover:text-white transition-all duration-300"
        >
          {t.pages.back_to_tests}
        </Link>
      </div>
    );
  }

  const pdfUrl = `/tests/${test.file}`;
  const testName = lang === "ua" ? test.name.ua : test.name.en;

  if (!available) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
          {t.pages.pdf_unavailable}
        </p>
        <h1 className="metallic text-3xl md:text-5xl font-extralight tracking-[0.15em] uppercase mb-8">
          {testName}
        </h1>
        <Link
          href="/tests"
          className="px-8 py-3 border border-accent/40 text-text-secondary text-sm tracking-[0.3em] uppercase hover:border-accent hover:text-white transition-all duration-300"
        >
          {t.pages.back_to_tests}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 md:px-8 flex flex-col">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl w-full mx-auto mb-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 text-text-secondary text-sm tracking-wider hover:text-white transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t.pages.back_to_tests}
          </Link>

          <h1 className="flex-1 text-white/90 text-lg md:text-xl font-light tracking-wide truncate">
            {testName}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom controls */}
            {!isMobile && (
              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={zoomOut}
                  title={t.pages.viewer_zoom_out}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-sm text-text-secondary hover:border-accent/30 hover:text-white transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="text-text-secondary/60 text-xs w-10 text-center tabular-nums">{zoom}%</span>
                <button
                  onClick={zoomIn}
                  title={t.pages.viewer_zoom_in}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-sm text-text-secondary hover:border-accent/30 hover:text-white transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Fullscreen */}
            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                title={t.pages.fullscreen}
                className="w-8 h-8 flex items-center justify-center border border-white/10 rounded-sm text-text-secondary hover:border-accent/30 hover:text-white transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            )}

            {/* Download */}
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 border border-accent/30 text-accent text-xs tracking-[0.15em] uppercase rounded-sm hover:border-accent hover:bg-accent/10 transition-all duration-300"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">{t.pages.download}</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* PDF viewer */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 max-w-7xl w-full mx-auto rounded-sm border border-white/[0.08] bg-white/[0.02] overflow-hidden relative"
        style={{ minHeight: "70vh" }}
      >
        {isMobile ? (
          /* Mobile fallback */
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 p-8 text-center">
            <div className="w-16 h-20 flex items-center justify-center border border-accent/30 rounded-sm bg-accent/5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent/60">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-text-secondary text-sm tracking-wider max-w-xs">
              {testName}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-accent/40 text-accent text-sm tracking-[0.2em] uppercase hover:border-accent hover:bg-accent/10 transition-all duration-300"
              >
                {t.pages.open_pdf}
              </a>
              <a
                href={pdfUrl}
                download
                className="px-8 py-3 border border-white/10 text-text-secondary text-sm tracking-[0.2em] uppercase hover:border-white/30 hover:text-white transition-all duration-300"
              >
                {t.pages.download}
              </a>
            </div>
          </div>
        ) : (
          /* Desktop iframe viewer */
          <div className="w-full h-full" style={{ minHeight: "70vh" }}>
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&zoom=${zoom}`}
              className="w-full border-0 bg-neutral-800"
              style={{ height: "calc(100vh - 140px)", minHeight: "70vh" }}
              title={testName}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
