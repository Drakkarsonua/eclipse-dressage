"use client";

import dynamic from "next/dynamic";
import Preloader from "@/components/UI/Preloader";
import Hero3D from "@/components/Hero/Hero3D";
import MessageSection from "@/components/Sections/MessageSection";
import UpcomingEvents from "@/components/Sections/UpcomingEvents";
import HorsesCarousel from "@/components/Sections/HorsesCarousel";
import Stats from "@/components/Sections/Stats";
import Partners from "@/components/Sections/Partners";
import SocialGrid from "@/components/Sections/SocialGrid";
import Footer from "@/components/Footer/Footer";

const PhotoGallery = dynamic(
  () => import("@/components/Sections/PhotoGallery"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <Preloader />

      <main>
        <Hero3D />
        <MessageSection />
        <PhotoGallery />
        <UpcomingEvents />
        <HorsesCarousel />
        <Stats />
        <Partners />
        <SocialGrid />
      </main>

      <Footer />
    </>
  );
}
