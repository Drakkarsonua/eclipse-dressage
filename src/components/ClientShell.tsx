"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "@/components/Navigation/Navbar";
import AnimatedBackground from "@/components/UI/AnimatedBackground";
import SmoothScroll from "@/components/UI/SmoothScroll";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SmoothScroll />
      <AnimatedBackground />
      <Navbar />
      <div className="relative z-[1]">{children}</div>
    </LanguageProvider>
  );
}
