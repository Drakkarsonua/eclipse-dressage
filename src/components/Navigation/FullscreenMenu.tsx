"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import PlaceholderImage from "../UI/PlaceholderImage";
import { useTranslation } from "@/lib/LanguageContext";

const menuKeys = [
  { key: "home" as const, href: "/" },
  { key: "competitions" as const, href: "/competitions" },
  { key: "gallery" as const, href: "/gallery" },
  { key: "team" as const, href: "/team" },
  { key: "horses" as const, href: "/horses" },
  { key: "tests" as const, href: "/tests" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
];

interface FullscreenMenuProps {
  onClose: () => void;
}

export default function FullscreenMenu({ onClose }: FullscreenMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!itemsRef.current) return;

    const items = itemsRef.current.querySelectorAll(".menu-item");
    gsap.fromTo(
      items,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.3 }
    );

    const photos = menuRef.current?.querySelectorAll(".menu-photo");
    if (photos) {
      gsap.fromTo(
        photos,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out", delay: 0.4 }
      );
    }
  }, []);

  return (
    <motion.div
      ref={menuRef}
      className="fixed inset-0 z-[105] bg-surface/98 backdrop-blur-lg"
      initial={{ y: "-100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-6 md:top-6 md:right-12 z-[110] w-8 h-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="h-full flex flex-col md:flex-row pt-24 pb-8 px-6 md:px-12">
        <div className="hidden md:grid md:w-1/2 grid-cols-3 grid-rows-2 gap-3 p-8 self-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`menu-photo overflow-hidden rounded-sm ${i === 1 ? "col-span-2 row-span-2" : ""}`}
            >
              <PlaceholderImage
                height={i === 1 ? "100%" : "160px"}
                label={`Photo ${i}`}
                className="rounded-sm"
              />
            </div>
          ))}
        </div>

        <div ref={itemsRef} className="flex-1 flex flex-col justify-center md:pl-16">
          <nav className="space-y-2 md:space-y-4">
            {menuKeys.map((item, i) => (
              <div key={item.key} className="menu-item overflow-hidden">
                <button
                  onClick={() => { onClose(); router.push(item.href); }}
                  className="group flex items-center gap-4 py-2 w-full text-left"
                >
                  <span className="text-accent text-sm font-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-wider uppercase text-white/90 group-hover:metallic transition-all duration-300 group-hover:translate-x-4">
                    {t.nav[item.key]}
                  </span>
                </button>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-8 flex gap-6">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="menu-item text-sm text-text-secondary hover:text-white tracking-widest uppercase transition-colors duration-300"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
