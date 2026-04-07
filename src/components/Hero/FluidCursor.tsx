"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Metaball fluid cursor — pure 2D Canvas, no dependencies            */
/*  Colored blobs track the mouse with inertia + blur                  */
/* ------------------------------------------------------------------ */

interface Blob {
  x: number;
  y: number;
  tx: number;
  ty: number;
  r: number;
  color: string;
  speed: number;
  phase: number;       // idle orbit phase
  orbitR: number;      // idle orbit radius
  orbitSpeed: number;  // idle orbit speed
}

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let animId = 0;
    let opacity = 1;
    const mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w;
      canvas.height = h;
    };

    // Create blobs — mix of blue and green
    const blobs: Blob[] = [
      // Primary blob — follows cursor directly
      { x: 0, y: 0, tx: 0, ty: 0, r: 120, color: "rgba(27,42,74,0.6)",  speed: 0.08, phase: 0,   orbitR: 0,  orbitSpeed: 0 },
      // Secondary blobs — follow with delay + idle orbiting
      { x: 0, y: 0, tx: 0, ty: 0, r: 90,  color: "rgba(26,77,46,0.5)",  speed: 0.04, phase: 0,   orbitR: 60, orbitSpeed: 0.8 },
      { x: 0, y: 0, tx: 0, ty: 0, r: 70,  color: "rgba(27,42,74,0.4)",  speed: 0.03, phase: 2.1, orbitR: 80, orbitSpeed: 0.6 },
      { x: 0, y: 0, tx: 0, ty: 0, r: 60,  color: "rgba(26,77,46,0.35)", speed: 0.025,phase: 4.2, orbitR: 100,orbitSpeed: 0.5 },
      { x: 0, y: 0, tx: 0, ty: 0, r: 50,  color: "rgba(138,141,144,0.2)", speed: 0.02, phase: 1.5, orbitR: 70, orbitSpeed: 0.7 },
    ];

    // Initialize blob positions to center
    const initPositions = () => {
      for (const b of blobs) {
        b.x = w / 2;
        b.y = h / 2;
        b.tx = w / 2;
        b.ty = h / 2;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    // Scroll-based opacity — fade out when hero scrolls away
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const heroBottom = rect.bottom;
      const fadeStart = h * 0.5;
      if (heroBottom <= 0) {
        opacity = 0;
      } else if (heroBottom < fadeStart) {
        opacity = heroBottom / fadeStart;
      } else {
        opacity = 1;
      }
    };

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (opacity <= 0.01) {
        animId = requestAnimationFrame(draw);
        return;
      }

      time += 0.016;
      ctx.globalAlpha = opacity;

      for (const b of blobs) {
        // Target position: mouse or idle orbit around center
        if (mouse.active) {
          b.tx = mouse.x;
          b.ty = mouse.y;
        } else {
          b.tx = w / 2 + Math.cos(time * b.orbitSpeed + b.phase) * b.orbitR;
          b.ty = h / 2 + Math.sin(time * b.orbitSpeed + b.phase) * b.orbitR;
        }

        // Lerp toward target
        b.x += (b.tx - b.x) * b.speed;
        b.y += (b.ty - b.y) * b.speed;

        // Draw radial gradient blob
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    resize();
    initPositions();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    onScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[1] pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-auto"
        style={{ filter: "blur(40px)", willChange: "transform" }}
      />
    </div>
  );
}
