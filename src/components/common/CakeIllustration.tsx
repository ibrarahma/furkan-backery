import React, { useState } from 'react';
import { Cake as CakeIcon, Sparkles } from 'lucide-react';

interface CakeIllustrationProps {
  name: string;
  category?: string;
  themeColor?: string;
  imageUrl?: string;
  className?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1' | 'auto';
  showBadge?: boolean;
}

export function CakeIllustration({
  name,
  category = 'Celebration Cake',
  themeColor = '#881337',
  imageUrl,
  className = '',
  aspectRatio = '4/3',
  showBadge = true
}: CakeIllustrationProps) {
  const [imageError, setImageError] = useState(false);

  // Compute tasteful gradients based on the themeColor
  const getGradientForColor = (color: string) => {
    switch (color) {
      case '#3E2723': // Dark Chocolate
        return {
          bg: 'from-[#2A1810] via-[#3E2723] to-[#1A0E0A]',
          accent: '#E6B980',
          frosting: '#5D4037',
          topping: '#D7CCC8',
          label: 'Rich Chocolate Ganache'
        };
      case '#881337': // Red Velvet
        return {
          bg: 'from-[#4C0519] via-[#881337] to-[#831843]',
          accent: '#FFE4E6',
          frosting: '#FFF1F2',
          topping: '#BE123C',
          label: 'Cream Cheese & Velvet'
        };
      case '#450A0A': // Black Forest
        return {
          bg: 'from-[#3A0707] via-[#450A0A] to-[#2B0404]',
          accent: '#FECDD3',
          frosting: '#FFFFFF',
          topping: '#E11D48',
          label: 'Sour Cherry & Cocoa'
        };
      case '#F59E0B': // White Forest / Mango
        return {
          bg: 'from-[#78350F] via-[#B45309] to-[#D97706]',
          accent: '#FEF3C7',
          frosting: '#FFFBEB',
          topping: '#F59E0B',
          label: 'Whipped Blossom & Fruit'
        };
      case '#B45309': // Butterscotch
        return {
          bg: 'from-[#451A03] via-[#78350F] to-[#92400E]',
          accent: '#FDE68A',
          frosting: '#FEF3C7',
          topping: '#D97706',
          label: 'Caramelized Praline'
        };
      case '#047857': // Fresh Fruit
        return {
          bg: 'from-[#064E3B] via-[#047857] to-[#065F46]',
          accent: '#A7F3D0',
          frosting: '#ECFDF5',
          topping: '#EF4444',
          label: 'Fresh Farm Fruits'
        };
      case '#DC2626': // Kitkat
        return {
          bg: 'from-[#7F1D1D] via-[#991B1B] to-[#B91C1C]',
          accent: '#FCA5A5',
          frosting: '#451A03',
          topping: '#F59E0B',
          label: 'Crisp Wafer & Gems'
        };
      case '#9333EA': // Unicorn
        return {
          bg: 'from-[#581C87] via-[#7E22CE] to-[#A855F7]',
          accent: '#F3E8FF',
          frosting: '#FAF5FF',
          topping: '#F472B6',
          label: 'Pastel Rosette Dream'
        };
      default:
        return {
          bg: 'from-[#3E2723] via-[#4A3B32] to-[#2A1E17]',
          accent: '#FDE68A',
          frosting: '#FAF7F2',
          topping: '#BE123C',
          label: 'Artisan Pastry'
        };
    }
  };

  const scheme = getGradientForColor(themeColor);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : '';

  if (imageUrl && !imageError) {
    return (
      <div className={`relative overflow-hidden bg-[#F3EDE2] ${aspectClass} ${className}`}>
        <img
          src={imageUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
    );
  }

  // High-fidelity handcrafted SVG Bakery Illustration Fallback
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${scheme.bg} flex flex-col items-center justify-center p-6 text-white select-none ${aspectClass} ${className}`}
    >
      {/* Subtle background radial glow */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 45%, ${scheme.accent} 0%, transparent 70%)`
        }}
      />

      {/* Decorative bakery texture grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Stylized Illustrated Cake Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 200 160"
          className="w-36 h-28 sm:w-44 sm:h-36 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cake Stand Pedestal */}
          <path
            d="M50 145 H150 C145 140 135 136 120 135 H80 C65 136 55 140 50 145 Z"
            fill="#D5C5B5"
            opacity="0.8"
          />
          <path d="M92 135 H108 V146 H92 Z" fill="#BFAF9E" />
          <ellipse cx="100" cy="134" rx="68" ry="10" fill="#EADBCE" />

          {/* Bottom Cake Layer */}
          <rect x="42" y="88" width="116" height="42" rx="6" fill="#3D291F" />
          <ellipse cx="100" cy="88" rx="58" ry="12" fill={scheme.frosting} />
          {/* Bottom Frosting Driplets */}
          <path
            d="M42 90 Q50 102 58 90 Q68 106 78 90 Q88 104 98 90 Q110 106 122 90 Q134 104 144 90 Q152 100 158 90"
            fill={scheme.frosting}
          />

          {/* Top Cake Layer */}
          <rect x="60" y="52" width="80" height="36" rx="5" fill="#4E3427" />
          <ellipse cx="100" cy="52" rx="40" ry="9" fill={scheme.frosting} />
          {/* Top Driplets */}
          <path
            d="M60 54 Q68 64 76 54 Q86 67 96 54 Q106 65 116 54 Q128 66 140 54"
            fill={scheme.frosting}
          />

          {/* Crown Rosettes & Cherries / Berries */}
          <circle cx="75" cy="48" r="7" fill={scheme.topping} />
          <circle cx="100" cy="46" r="8" fill={scheme.topping} />
          <circle cx="125" cy="48" r="7" fill={scheme.topping} />

          {/* Sparkle highlights on cherries */}
          <circle cx="73" cy="46" r="2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="98" cy="44" r="2.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="123" cy="46" r="2" fill="#FFFFFF" opacity="0.8" />

          {/* Golden Celebration Sparkle */}
          <path
            d="M100 24 L102 32 L110 34 L102 36 L100 44 L98 36 L90 34 L98 32 Z"
            fill="#FBBF24"
            filter="drop-shadow(0 0 4px #F59E0B)"
          />
        </svg>

        {/* Category & Craft note */}
        {showBadge && (
          <div className="mt-2 text-center">
            <span className="text-[11px] font-medium tracking-wider uppercase text-amber-200/90 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {scheme.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
