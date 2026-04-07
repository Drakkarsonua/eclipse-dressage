"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "../UI/Marquee";
import FluidCursor from "./FluidCursor";
import { useTranslation } from "@/lib/LanguageContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero3D() {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const fadeTriggerRef = useRef<ScrollTrigger | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // ── Scroll-driven zoom-out + element reveals ──
  useEffect(() => {
    if (!wrapperRef.current || !sceneRef.current || !textRef.current || !marqueeRef.current) return;

    const wrapper = wrapperRef.current;
    const scene = sceneRef.current;
    const els = textRef.current.querySelectorAll(".hero-animate");
    const marquee = marqueeRef.current;
    const navbar = document.querySelector("header");

    // Initial states
    gsap.set(scene, { scale: 1.5 });
    gsap.set(els, { y: 60, opacity: 0 });
    gsap.set(marquee, { opacity: 0, y: 20 });
    if (navbar) gsap.set(navbar, { y: -100, opacity: 0 });

    // Main zoom-out timeline — scrubbed by scroll over 200vh
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: 0.8,
        pinSpacing: true,
        onEnter: () => {
          // Ensure navbar is hidden when entering from top
        },
      },
    });

    triggerRef.current = tl.scrollTrigger!;

    // 0–100%: Scene zooms from 1.5 → 1.0
    tl.to(scene, {
      scale: 1,
      ease: "none",
    }, 0);

    // 30–60%: Text fades in + slides up
    tl.fromTo(els,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, ease: "none" },
      0.3
    );

    // 50–75%: Navbar slides down
    if (navbar) {
      tl.fromTo(navbar,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, ease: "none" },
        0.5
      );
    }

    // 70–90%: Marquee appears
    tl.fromTo(marquee,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ease: "none" },
      0.7
    );

    // 90–100%: Hold — everything visible at full zoom
    tl.to({}, { duration: 0.1 });

    // ── Text fade-out: separate ScrollTrigger after the pinned section ──
    // This triggers after the pin releases, over the next 100vh of scroll
    const fadeEl = textRef.current;
    fadeTriggerRef.current = ScrollTrigger.create({
      trigger: wrapper,
      start: "bottom top",
      end: "+=50%",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        // First 40% — text stays visible; 40–100% — text fades out
        if (p < 0.4) {
          gsap.set(els, { opacity: 1, scale: 1 });
        } else {
          const fadeP = (p - 0.4) / 0.6;
          gsap.set(els, {
            opacity: 1 - fadeP,
            scale: 1 + fadeP * 0.08,
          });
        }
      },
    });

    return () => {
      if (triggerRef.current) triggerRef.current.kill();
      if (fadeTriggerRef.current) fadeTriggerRef.current.kill();
      tl.kill();
    };
  }, []);

  // ── Logo mouse-follow tilt ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.04;
      current.current.y += (mouse.current.y - current.current.y) * 0.04;

      if (logoRef.current) {
        const rotY = current.current.x * 10;
        const rotX = current.current.y * -8;
        logoRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    /* 200vh wrapper — gives scroll room for the pinned zoom-out */
    <div ref={wrapperRef} className="relative w-full" style={{ height: "200vh" }}>
      <section className="relative w-full h-screen overflow-hidden">
        {/* Fluid cursor distortion */}
        <FluidCursor />

        {/* Zoomable scene wrapper */}
        <div
          ref={sceneRef}
          className="absolute inset-0 will-change-transform origin-center"
        >
          {/* Logo placeholder — center of screen */}
          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            <div
              ref={logoRef}
              className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full flex flex-col items-center justify-center gap-4 will-change-transform"
              style={{
                border: "2px dashed rgba(255,255,255,0.3)",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/30"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-white/30 text-sm tracking-[0.4em] uppercase">
                Logo
              </span>
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-surface/30 via-transparent to-surface/60 pointer-events-none" />
        </div>

        {/* Text — scroll-controlled appear / fade */}
        <div
          ref={textRef}
          className="absolute inset-0 z-[3] flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        >
          <h1
            className="hero-animate metallic text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-extralight tracking-[0.2em] uppercase leading-none"
            style={{ opacity: 0 }}
          >
            ECLIPSE
          </h1>
          <p
            className="hero-animate text-text-secondary text-lg sm:text-xl md:text-2xl tracking-[0.5em] uppercase mt-4 md:mt-6 font-light"
            style={{ opacity: 0 }}
          >
            {t.hero.subtitle}
          </p>
        </div>

        {/* Bottom marquee */}
        <div
          ref={marqueeRef}
          className="absolute bottom-0 left-0 right-0 z-[3] py-4 border-t border-white/5"
          style={{ opacity: 0 }}
        >
          <Marquee
            items={[...t.marquee]}
            className="text-text-secondary/30 text-sm tracking-[0.3em] uppercase"
            speed={25}
          />
        </div>
      </section>
    </div>
  );
}
