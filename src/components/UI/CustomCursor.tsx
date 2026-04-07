"use client";

import { useEffect, useRef, useState } from "react";

/*
  Morph Cursor
  – Follows mouse with lerp delay
  – Morphs shape/size/label based on data-cursor attribute on hovered element
  – Hidden on mobile (pointer: coarse)
*/

type CursorState = "default" | "view" | "explore" | "menu" | "close" | "drag";

const LABELS: Record<CursorState, string> = {
  default: "",
  view: "View",
  explore: "Explore",
  menu: "Menu",
  close: "✕",
  drag: "← →",
};

const SIZES: Record<CursorState, number> = {
  default: 8,
  view: 60,
  explore: 80,
  menu: 60,
  close: 60,
  drag: 80,
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobile);
    if (mobile) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let visible = false;
    let currentState: CursorState = "default";
    let currentSize = SIZES.default;
    let targetSize = SIZES.default;
    let animId = 0;

    const setCursorStyle = (state: CursorState) => {
      if (state === currentState) return;
      currentState = state;
      targetSize = SIZES[state];
      const txt = LABELS[state];
      label.textContent = txt;
      label.style.opacity = txt ? "1" : "0";

      if (state === "default") {
        cursor.style.background = "transparent";
        cursor.style.backdropFilter = "none";
        (cursor.style as any).webkitBackdropFilter = "none";
      } else {
        cursor.style.background = "rgba(255,255,255,0.1)";
        cursor.style.backdropFilter = "blur(4px)";
        (cursor.style as any).webkitBackdropFilter = "blur(4px)";
      }

      // Stretch horizontally for drag
      if (state === "drag") {
        cursor.style.borderRadius = "30px";
      } else {
        cursor.style.borderRadius = "50%";
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        cursor.style.opacity = "1";
        // Snap to position on first move
        curX = mouseX;
        curY = mouseY;
      }

      // Detect hovered element's data-cursor
      const target = e.target as HTMLElement;
      const el = target.closest("[data-cursor]") as HTMLElement | null;
      if (el) {
        const state = el.getAttribute("data-cursor") as CursorState;
        setCursorStyle(state && SIZES[state] ? state : "view");
      } else if (target.closest("a, button")) {
        setCursorStyle("view");
      } else {
        setCursorStyle("default");
      }
    };

    const onMouseLeave = () => {
      visible = false;
      cursor.style.opacity = "0";
    };

    const onMouseEnter = () => {
      visible = true;
      cursor.style.opacity = "1";
    };

    const animate = () => {
      // Lerp position
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;

      // Lerp size
      currentSize += (targetSize - currentSize) * 0.15;

      const w = currentState === "drag" ? currentSize * 1.4 : currentSize;
      const h = currentSize;

      cursor.style.width = `${w}px`;
      cursor.style.height = `${h}px`;
      cursor.style.transform = `translate(${curX - w / 2}px, ${curY - h / 2}px)`;

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[10000] pointer-events-none mix-blend-difference"
      style={{
        opacity: 0,
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "transparent",
        transition: "width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
      }}
    >
      <span
        ref={labelRef}
        style={{
          opacity: 0,
          color: "#fff",
          fontSize: "10px",
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "2px",
          transition: "opacity 0.2s ease",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      />
    </div>
  );
}
