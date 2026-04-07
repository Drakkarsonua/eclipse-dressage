"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import FullscreenMenu from "./FullscreenMenu";
import { useTranslation } from "@/lib/LanguageContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, toggleLang } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-surface/80 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-4 md:py-6">
          <Link
            href="/"
            className="metallic text-xl md:text-2xl font-light tracking-[0.3em] uppercase"
          >
            ECLIPSE
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-xs tracking-[0.15em] uppercase"
              aria-label="Toggle language"
            >
              <span className={lang === "ua" ? "text-white" : "text-white/40"}>
                UA
              </span>
              <span className="text-white/20">|</span>
              <span className={lang === "en" ? "text-white" : "text-white/40"}>
                EN
              </span>
            </button>

            {/* Burger */}
            {!isMenuOpen && (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex flex-col gap-[6px] w-8 h-8 items-center justify-center"
                aria-label="Open menu"
              >
                <span className="block w-7 h-[1px] bg-white" />
                <span className="block w-7 h-[1px] bg-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <FullscreenMenu onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
