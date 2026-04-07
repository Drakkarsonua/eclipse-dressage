"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";

interface GalleryPhoto {
  image: string;
  caption: string;
}

export default function GalleryPage() {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data: GalleryPhoto[]) => {
        setPhotos(data.filter((p) => p.image));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i !== null && i < photos.length - 1 ? i + 1 : i));
      if (e.key === "ArrowLeft") setLightbox((i) => (i !== null && i > 0 ? i - 1 : i));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, photos.length]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
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
          {t.pages.gallery_label}
        </p>
        <h1 className="metallic text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-4">
          {t.pages.gallery_title}
        </h1>

        {loading && (
          <div className="flex items-center justify-center py-32">
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
          </div>
        )}

        {!loading && photos.length === 0 && (
          <div className="text-center py-32">
            <p className="text-text-secondary">{t.pages.gallery_empty}</p>
          </div>
        )}

        {!loading && photos.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-12">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                className="mb-4 break-inside-avoid cursor-pointer group"
                onClick={() => setLightbox(i)}
              >
                <div className="relative overflow-hidden rounded-sm border border-white/[0.06] hover:border-accent/30 transition-all duration-500">
                  <img
                    src={photo.image}
                    alt={photo.caption || ""}
                    className="w-full block group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white/90 text-sm tracking-wider">{photo.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9000] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition z-10"
              onClick={() => setLightbox(null)}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Prev */}
            {lightbox > 0 && (
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition z-10"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Next */}
            {lightbox < photos.length - 1 && (
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition z-10"
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={photos[lightbox].image}
              alt={photos[lightbox].caption || ""}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption */}
            {photos[lightbox].caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <p className="text-white/70 text-sm tracking-wider text-center">
                  {photos[lightbox].caption}
                </p>
                <p className="text-white/30 text-xs text-center mt-1">
                  {lightbox + 1} / {photos.length}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
