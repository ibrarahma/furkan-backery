import React from 'react';
import { Heart, ShieldCheck, Sparkles, Utensils, Award, Users, CheckCircle } from 'lucide-react';
import { BakeryConfig } from '../config/bakeryConfig';

interface AboutPageProps {
  config: BakeryConfig;
  onNavigateToMenu: () => void;
}

export function AboutPage({ config, onNavigateToMenu }: AboutPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-wider text-[#881337]">
          Our Story & Craft
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2A1E17]">
          Baking with Passion, Delivering Smiles in {config.city}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {config.businessName} began with a simple belief: every milestone, birthday, and celebration deserves a cake that tastes just as memorable as it looks.
        </p>
      </div>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-7 rounded-2xl border border-[#EADBCE] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
            Real Butter & Belgian Cocoa
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            No premixes, no artificial compound substitutes. We source 54% dark Belgian chocolate couverture, pure dairy butter, and farm-fresh cream for uncompromised decadence.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-[#EADBCE] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#881337] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
            Vegetarian-First Kitchen
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Hyderabad is a vibrant food hub with distinct dietary traditions. We have perfected eggless baking so our vegetarian cakes are light, spongy, and melt-in-mouth soft.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-[#EADBCE] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2A1E17]">
            Certified Clean Kitchen
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Operating under FSSAI license #{config.fssaiNumber}. All pastries are prepared under strict temperature control, UV-filtered water, and daily sanitization protocols.
          </p>
        </div>
      </div>

      {/* Head Chef Quote Strip */}
      <div className="bg-[#2A1E17] text-white rounded-3xl p-8 sm:p-12 border border-stone-800 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <p className="font-serif text-xl sm:text-2xl italic leading-relaxed text-amber-100">
            "A cake isn't just dessert; it's the centerpiece of joy where families gather, candles are blown, and memories are forever sealed. That is why we treat every order like our own celebration."
          </p>
          <div className="pt-2">
            <p className="font-bold text-sm text-white">Chef Farhan & The Sweet Crumbs Team</p>
            <p className="text-xs text-stone-400">Pastry Artisans, Banjara Hills Studio</p>
          </div>
        </div>
      </div>

      {/* Serving Hyderabad */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EADBCE] space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#2A1E17]">
          Proudly Serving All Across Hyderabad
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          From early morning surprise parties to late-night midnight birthdays, our dedicated fleet of temperature-stabilized two-wheelers and vans deliver with utmost care to:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {config.servingAreas.map((area) => (
            <div
              key={area}
              className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCE] text-xs font-semibold text-stone-800 text-center"
            >
              {area}
            </div>
          ))}
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={onNavigateToMenu}
            className="px-7 py-3.5 bg-[#881337] hover:bg-[#6e0f2c] text-white font-semibold text-sm rounded-xl transition-colors shadow-md cursor-pointer"
          >
            Taste Our Creations Today
          </button>
        </div>
      </div>
    </div>
  );
}
