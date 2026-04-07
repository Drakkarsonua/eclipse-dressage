"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function HorsesPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
        {t.pages.coming_soon}
      </p>
      <h1 className="metallic text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-8">
        {t.nav.horses}
      </h1>
      <Link
        href="/"
        className="px-8 py-3 border border-accent/40 text-text-secondary text-sm tracking-[0.3em] uppercase hover:border-accent hover:text-white transition-all duration-300"
      >
        {t.pages.back_home}
      </Link>
    </div>
  );
}
