import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | Garden Station",
    default: "Garden Station — Automated Indoor Growing System",
  },
  description: "Garden Station automates your entire plant lifecycle using computer vision, AI decisions, and precise hardware control. No cloud required.",
  metadataBase: new URL("https://gardenstation.app"),
  keywords: ["garden station", "automated indoor growing", "hydroponics", "computer vision garden", "AI plant care"],
  authors: [{ name: "Garden Station Team" }],
  openGraph: {
    title: {
      template: "%s | Garden Station",
      default: "Garden Station — Automated Indoor Growing System",
    },
    description: "Garden Station automates your entire plant lifecycle using computer vision, AI decisions, and precise hardware control. No cloud required.",
    type: "website",
    siteName: "Garden Station",
    url: "https://gardenstation.app",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`antialiased font-sans text-gray-900 bg-white ${inter.variable}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
