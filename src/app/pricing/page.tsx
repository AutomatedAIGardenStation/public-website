import React from "react";
import { Metadata } from "next";
import VersionsSection from "@/components/sections/VersionsSection";

export const metadata: Metadata = {
  title: "Pricing & Versions",
  description: "Find the right Garden Station automated growing system version for your needs.",
  alternates: {
    canonical: "/pricing/",
  },
};

export default function PricingPage() {
  return (
    <main className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Pricing & Versions
        </h1>
        <p className="text-xl text-gray-600">
          Find the right Garden Station for your needs.
        </p>
      </div>
      <VersionsSection />
    </main>
  );
}
