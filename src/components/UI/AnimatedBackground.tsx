"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  (a) Floating particles — canvas-based                             */
/* ------------------------------------------------------------------ */

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let w = 0;
    let h = 0;

    const colors = [
      "rgba(255,255,255,",   // white
      "rgba(27,42,74,",      // blue #1B2A4A
      "rgba(26,77,46,",      // green #1A4D2E
      "rgba(184,188,192,",   // accent light
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      opacity: number;
    }

    const particles: Particle[] = [];
    const COUNT = 40;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.3 + 0.15,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  (b) Gradient blobs — CSS animated                                  */
/* ------------------------------------------------------------------ */

function GradientBlobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Blue blob */}
      <div
        className="absolute rounded-full animate-blob-1"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, #1B2A4A 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.15,
          top: "10%",
          left: "10%",
          willChange: "transform",
        }}
      />
      {/* Green blob */}
      <div
        className="absolute rounded-full animate-blob-2"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #1A4D2E 0%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.12,
          bottom: "15%",
          right: "10%",
          willChange: "transform",
        }}
      />
      {/* Gray blob */}
      <div
        className="absolute rounded-full animate-blob-3"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, #8A8D90 0%, transparent 70%)",
          filter: "blur(120px)",
          opacity: 0.08,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  (c) Grid lines — with scroll parallax                              */
/* ------------------------------------------------------------------ */

function GridLines() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (gridRef.current) {
          const offset = window.scrollY * 0.05;
          gridRef.current.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        willChange: "transform",
        opacity: 0.05,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  (d) Twinkling stars                                                */
/* ------------------------------------------------------------------ */

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function TwinklingStars() {
  const [stars] = useState<Star[]>(() => {
    const s: Star[] = [];
    for (let i = 0; i < 20; i++) {
      s.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 3,
      });
    }
    return s;
  });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Combined export                                                    */
/* ------------------------------------------------------------------ */

export default function AnimatedBackground() {
  return (
    <>
      <GridLines />
      <GradientBlobs />
      <Particles />
      <TwinklingStars />
    </>
  );
}
