import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ClientShell from "@/components/ClientShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECLIPSE — Dressage Team",
  description:
    "Eclipse Dressage Team — Excellence, precision, and elegance in every stride.",
  keywords: ["dressage", "equestrian", "horses", "eclipse", "team"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface text-white antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
