import React, { useId } from 'react';
import { CustomCakeDesign } from '../../types/cakeDesigner';
import { Sparkles, Eye, RotateCw } from 'lucide-react';

interface CakePreviewProps {
  design: CustomCakeDesign;
  onToggleViewAngle?: () => void;
  className?: string;
}

/**
 * Helper to darken/lighten hex color for 3D volumetric shading
 */
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export function CakePreview({
  design,
  onToggleViewAngle,
  className = ''
}: CakePreviewProps) {
  const filterId = useId();

  // Sponge & filling visual colors
  const getSpongeColor = (sponge: string) => {
    switch (sponge) {
      case 'Chocolate':
        return '#3D2415';
      case 'Vanilla':
        return '#F5D061';
      case 'Strawberry':
        return '#F472B6';
      case 'Red Velvet':
        return '#881337';
      case 'Butterscotch':
        return '#D97706';
      default:
        return '#F5D061';
    }
  };

  const getFillingColor = (filling: string) => {
    switch (filling) {
      case 'Chocolate':
        return '#2E180B';
      case 'Strawberry':
        return '#BE123C';
      case 'Vanilla':
        return '#FEF08A';
      case 'Butterscotch':
        return '#B45309';
      case 'No filling':
      default:
        return 'transparent';
    }
  };

  const frostingBase = design.frostingColor || '#F472B6';
  const frostingShadow = adjustColor(frostingBase, -22);
  const frostingHighlight = adjustColor(frostingBase, 18);
  const spongeColor = getSpongeColor(design.sponge);
  const fillingColor = getFillingColor(design.filling);

  // Size scaling factor
  const getSizeScale = (size: string) => {
    switch (size) {
      case '0.5 kg':
        return 0.82;
      case '1 kg':
        return 0.95;
      case '1.5 kg':
        return 1.02;
      case '2 kg':
        return 1.08;
      case '3 kg':
        return 1.15;
      default:
        return 1.0;
    }
  };

  const scale = getSizeScale(design.size);
  const isTopView = design.viewAngle === 'top';

  // Has specific decorations
  const hasSprinkles = design.decorations.includes('sprinkles');
  const hasCherries = design.decorations.includes('cherries');
  const hasStrawberries = design.decorations.includes('strawberries');
  const hasChocoChips = design.decorations.includes('chocolate_chips');
  const hasCandles = design.decorations.includes('candles');
  const hasDrizzle = design.decorations.includes('chocolate_drizzle');
  const hasTopper = design.decorations.includes('birthday_topper');
  const hasHearts = design.decorations.includes('heart_decorations');

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* View Angle Switch Button */}
      {onToggleViewAngle && (
        <button
          type="button"
          onClick={onToggleViewAngle}
          className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-white/90 hover:bg-white text-stone-700 text-xs font-semibold rounded-xl shadow-sm border border-[#EADBCE] backdrop-blur-xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          title="Switch between 3D Front Perspective and Top-Down Decorating View"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#881337]" />
          <span>{isTopView ? 'Switch to 3D Front View' : 'Switch to Top-Down View'}</span>
        </button>
      )}

      {/* Bakery Stamp / Specs Tag */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 text-[11px] font-semibold text-stone-700 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#EADBCE] shadow-2xs">
        <span className="flex items-center gap-1 text-[#881337]">
          <Sparkles className="w-3 h-3" />
          {design.shape} · {design.size}
        </span>
      </div>

      {/* The Master Visual SVG Canvas */}
      <div className="w-full max-w-[420px] aspect-square flex items-center justify-center p-2">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-xl transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Filter for candle glow */}
            <filter id={`candle-glow-${filterId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Frosting Linear Gradient (3D Front) */}
            <linearGradient id={`frosting-front-${filterId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={frostingShadow} />
              <stop offset="35%" stopColor={frostingBase} />
              <stop offset="80%" stopColor={frostingHighlight} />
              <stop offset="100%" stopColor={frostingShadow} />
            </linearGradient>

            {/* Frosting Top Face Radial Gradient */}
            <radialGradient id={`frosting-top-${filterId}`} cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor={frostingHighlight} />
              <stop offset="70%" stopColor={frostingBase} />
              <stop offset="100%" stopColor={frostingShadow} />
            </radialGradient>

            {/* Chocolate Ganache Drizzle Gradient */}
            <linearGradient id={`drizzle-grad-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A140A" />
              <stop offset="100%" stopColor="#170A04" />
            </linearGradient>

            {/* Gold Topper Metallic Gradient */}
            <linearGradient id={`gold-topper-${filterId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Cake Plate Ceramic Gradient */}
            <linearGradient id={`plate-grad-${filterId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F5ECE4" />
              <stop offset="100%" stopColor="#D8C8BA" />
            </linearGradient>
          </defs>

          {/* ============================================================== */}
          {/* VIEW MODE 1: 3D FRONT PERSPECTIVE VIEW */}
          {/* ============================================================== */}
          {!isTopView && (
            <g id="front-3d-view">
              {/* Stand & Plate Base Shadow */}
              <ellipse cx="200" cy="355" rx="160" ry="24" fill="#000000" opacity="0.12" />

              {/* Pedestal Stand Stem & Bottom Base */}
              <path
                d="M130 355 C130 340 170 338 185 330 L188 285 L212 285 L215 330 C230 338 270 340 270 355 Z"
                fill="url(#plate-grad-)"
                stroke="#CFC0B2"
                strokeWidth="1.5"
              />

              {/* Pedestal Top Tray / Plate Rim */}
              <ellipse cx="200" cy="285" rx="175" ry="32" fill="url(#plate-grad-)" stroke="#C8B8A9" strokeWidth="2" />
              <ellipse cx="200" cy="283" rx="168" ry="28" fill="#FBF7F2" stroke="#E3D5C8" strokeWidth="1" />

              {/* Dynamic Cake Group scaled by cake size */}
              <g transform={`translate(${200 * (1 - scale)}, ${215 * (1 - scale)}) scale(${scale})`}>
                {/* -------------------- 1. SHAPE: ROUND -------------------- */}
                {design.shape === 'Round' && (
                  <g id="cake-shape-round">
                    {/* Shadow under cake body on plate */}
                    <ellipse cx="200" cy="275" rx="122" ry="22" fill="#000000" opacity="0.15" />

                    {/* Cake Side Wall (Cylinder mantle) */}
                    <path
                      d="M 80 185 L 80 265 C 80 295, 320 295, 320 265 L 320 185 Z"
                      fill={`url(#frosting-front-${filterId})`}
                    />

                    {/* Sponge Crumb Base Reveal Strip (at bottom edge of cake) */}
                    <path
                      d="M 82 258 C 82 284, 318 284, 318 258 L 318 266 C 318 296, 82 296, 82 266 Z"
                      fill={spongeColor}
                    />

                    {/* Filling Stripe Reveal (if filling selected) */}
                    {design.filling !== 'No filling' && (
                      <path
                        d="M 82 232 C 82 258, 318 258, 318 232 L 318 238 C 318 264, 82 264, 82 238 Z"
                        fill={fillingColor}
                        opacity="0.9"
                      />
                    )}

                    {/* Bottom Piping Rosettes Rim */}
                    <path
                      d="M 80 265 Q 92 275 104 268 Q 116 278 128 270 Q 140 280 152 272 Q 164 282 176 274 Q 188 283 200 275 Q 212 283 224 274 Q 236 282 248 272 Q 260 280 272 270 Q 284 278 296 268 Q 308 275 320 265 C 320 278, 80 278, 80 265 Z"
                      fill={frostingHighlight}
                    />

                    {/* Cake Top Face Ellipse */}
                    <ellipse
                      cx="200"
                      cy="185"
                      rx="120"
                      ry="36"
                      fill={`url(#frosting-top-${filterId})`}
                      stroke={frostingHighlight}
                      strokeWidth="1.5"
                    />

                    {/* Top Scalloped Frosting Piping Beads */}
                    <path
                      d="M 80 185 Q 90 193 100 186 Q 110 194 120 187 Q 130 195 140 187 Q 150 196 160 188 Q 170 196 180 188 Q 190 197 200 189 Q 210 197 220 188 Q 230 196 240 188 Q 250 195 260 187 Q 270 194 280 186 Q 290 193 300 185 Q 310 192 320 185 C 320 178, 80 178, 80 185 Z"
                      fill={frostingHighlight}
                      opacity="0.85"
                    />
                  </g>
                )}

                {/* -------------------- 2. SHAPE: SQUARE -------------------- */}
                {design.shape === 'Square' && (
                  <g id="cake-shape-square">
                    {/* Shadow under square cake */}
                    <path d="M 90 275 L 200 305 L 310 275 L 200 250 Z" fill="#000000" opacity="0.15" />

                    {/* Left Front Side */}
                    <path
                      d="M 85 185 L 200 220 L 200 295 L 85 260 Z"
                      fill={frostingShadow}
                    />

                    {/* Right Front Side */}
                    <path
                      d="M 200 220 L 315 185 L 315 260 L 200 295 Z"
                      fill={frostingBase}
                    />

                    {/* Visible Sponge Base Edge */}
                    <path
                      d="M 85 252 L 200 287 L 200 295 L 85 260 Z"
                      fill={spongeColor}
                    />
                    <path
                      d="M 200 287 L 315 252 L 315 260 L 200 295 Z"
                      fill={spongeColor}
                    />

                    {/* Visible Filling Stripe */}
                    {design.filling !== 'No filling' && (
                      <g opacity="0.9">
                        <path d="M 85 228 L 200 263 L 200 268 L 85 233 Z" fill={fillingColor} />
                        <path d="M 200 263 L 315 228 L 315 233 L 200 268 Z" fill={fillingColor} />
                      </g>
                    )}

                    {/* Top Rhombus Face */}
                    <path
                      d="M 200 145 L 315 185 L 200 220 L 85 185 Z"
                      fill={`url(#frosting-top-${filterId})`}
                      stroke={frostingHighlight}
                      strokeWidth="1.5"
                    />

                    {/* Piping along edges */}
                    <path
                      d="M 85 185 L 200 220 L 315 185"
                      stroke={frostingHighlight}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {/* -------------------- 3. SHAPE: HEART -------------------- */}
                {design.shape === 'Heart' && (
                  <g id="cake-shape-heart">
                    {/* Shadow under heart */}
                    <path
                      d="M 200 300 C 120 260 80 230 110 200 C 130 180 170 190 200 215 C 230 190 270 180 290 200 C 320 230 280 260 200 300 Z"
                      fill="#000000"
                      opacity="0.15"
                    />

                    {/* Extruded 3D Heart Walls */}
                    <path
                      d="M 95 190 C 80 225 130 260 200 292 C 270 260 320 225 305 190 L 305 205 C 320 240 270 275 200 307 C 130 275 80 240 95 205 Z"
                      fill={`url(#frosting-front-${filterId})`}
                    />

                    {/* Side Body Extrusion */}
                    <path
                      d="M 95 185 L 95 230 C 95 260 150 285 200 298 C 250 285 305 260 305 230 L 305 185 C 325 215 285 255 200 298 C 115 255 75 215 95 185 Z"
                      fill={frostingShadow}
                    />

                    {/* Heart Top Face */}
                    <path
                      d="M 200 235 C 130 185 85 170 95 145 C 105 120 150 120 175 142 L 200 162 L 225 142 C 250 120 295 120 305 145 C 315 170 270 185 200 235 Z"
                      fill={`url(#frosting-top-${filterId})`}
                      stroke={frostingHighlight}
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* -------------------- CHOCOLATE DRIZZLE -------------------- */}
                {hasDrizzle && (
                  <g id="decor-drizzle" fill="url(#drizzle-grad-)">
                    {/* Drizzle drips cascading from top edge */}
                    <path
                      d="M 90 186 C 94 198, 98 215, 102 215 C 106 215, 108 195, 114 187 C 122 198, 126 226, 132 226 C 138 226, 142 196, 150 188 C 158 200, 164 235, 172 235 C 180 235, 184 198, 194 189 C 204 200, 210 240, 220 240 C 230 240, 234 199, 244 188 C 254 200, 260 228, 268 228 C 276 228, 280 197, 288 186 C 296 195, 302 214, 308 214 C 314 214, 316 194, 320 185 Z"
                      fill="#261208"
                      opacity="0.95"
                    />
                    {/* Gloss highlight on drips */}
                    <circle cx="102" cy="212" r="2.5" fill="#5A341E" />
                    <circle cx="132" cy="222" r="3" fill="#5A341E" />
                    <circle cx="172" cy="231" r="3.5" fill="#5A341E" />
                    <circle cx="220" cy="236" r="3.5" fill="#5A341E" />
                    <circle cx="268" cy="224" r="3" fill="#5A341E" />
                  </g>
                )}

                {/* -------------------- SPRINKLES -------------------- */}
                {hasSprinkles && (
                  <g id="decor-sprinkles">
                    {/* Multicolored sugar rods and pearls scattered across top */}
                    <rect x="135" y="175" width="8" height="3" rx="1.5" fill="#EF4444" transform="rotate(25 135 175)" />
                    <rect x="160" y="165" width="8" height="3" rx="1.5" fill="#3B82F6" transform="rotate(-35 160 165)" />
                    <rect x="185" y="178" width="8" height="3" rx="1.5" fill="#10B981" transform="rotate(50 185 178)" />
                    <rect x="215" y="168" width="8" height="3" rx="1.5" fill="#F59E0B" transform="rotate(-15 215 168)" />
                    <rect x="245" y="174" width="8" height="3" rx="1.5" fill="#EC4899" transform="rotate(65 245 174)" />
                    <rect x="268" y="180" width="8" height="3" rx="1.5" fill="#8B5CF6" transform="rotate(-40 268 180)" />
                    <rect x="150" y="190" width="7" height="3" rx="1.5" fill="#FACC15" transform="rotate(10 150 190)" />
                    <rect x="235" y="192" width="7" height="3" rx="1.5" fill="#06B6D4" transform="rotate(-20 235 192)" />
                    <rect x="195" y="196" width="7" height="3" rx="1.5" fill="#EF4444" transform="rotate(80 195 196)" />
                    <circle cx="145" cy="182" r="2.5" fill="#F43F5E" />
                    <circle cx="175" cy="172" r="2.5" fill="#F59E0B" />
                    <circle cx="225" cy="180" r="2.5" fill="#10B981" />
                    <circle cx="255" cy="185" r="2.5" fill="#3B82F6" />
                    <circle cx="168" cy="185" r="2" fill="#EC4899" />
                    <circle cx="205" cy="175" r="2" fill="#FACC15" />
                  </g>
                )}

                {/* -------------------- CHOCOLATE CHIPS -------------------- */}
                {hasChocoChips && (
                  <g id="decor-chips">
                    {[
                      { x: 125, y: 178 },
                      { x: 155, y: 170 },
                      { x: 180, y: 185 },
                      { x: 220, y: 172 },
                      { x: 245, y: 182 },
                      { x: 275, y: 176 },
                      { x: 200, y: 168 }
                    ].map((pt, i) => (
                      <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                        <path d="M 0 0 C -4 -4 -3 -8 0 -10 C 3 -8 4 -4 0 0 Z" fill="#26140A" />
                        <circle cx="-1" cy="-5" r="1" fill="#4A2814" />
                      </g>
                    ))}
                  </g>
                )}

                {/* -------------------- HEART DECORATIONS -------------------- */}
                {hasHearts && (
                  <g id="decor-hearts">
                    {[
                      { x: 130, y: 174, s: 0.8, c: '#E11D48' },
                      { x: 168, y: 165, s: 0.9, c: '#F43F5E' },
                      { x: 200, y: 175, s: 1.0, c: '#FB7185' },
                      { x: 232, y: 166, s: 0.85, c: '#E11D48' },
                      { x: 270, y: 175, s: 0.8, c: '#F43F5E' }
                    ].map((h, i) => (
                      <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.s})`}>
                        <path
                          d="M 0 4 C -6 -4 -12 2 -4 8 L 0 12 L 4 8 C 12 2 6 -4 0 4 Z"
                          fill={h.c}
                          stroke="#FFF"
                          strokeWidth="0.8"
                        />
                      </g>
                    ))}
                  </g>
                )}

                {/* -------------------- STRAWBERRIES -------------------- */}
                {hasStrawberries && (
                  <g id="decor-strawberries">
                    {[
                      { x: 120, y: 175, rot: -18 },
                      { x: 165, y: 165, rot: -8 },
                      { x: 200, y: 162, rot: 0 },
                      { x: 235, y: 165, rot: 8 },
                      { x: 280, y: 175, rot: 18 }
                    ].map((sb, i) => (
                      <g key={i} transform={`translate(${sb.x}, ${sb.y}) rotate(${sb.rot})`}>
                        {/* Berry Heart Wedge */}
                        <path
                          d="M 0 -16 C -12 -12 -12 4 0 14 C 12 4 12 -12 0 -16 Z"
                          fill="#DC2626"
                          stroke="#B91C1C"
                          strokeWidth="1"
                        />
                        {/* Highlights */}
                        <path d="M -4 -8 C -7 -4 -6 2 -2 6" stroke="#FEF2F2" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                        {/* Green Calyx / Leaves */}
                        <path d="M 0 -16 L -5 -20 L -1 -17 L 0 -22 L 2 -17 L 6 -20 Z" fill="#15803D" />
                        {/* Seeds */}
                        <circle cx="-3" cy="-2" r="0.7" fill="#FEF08A" />
                        <circle cx="2" cy="-1" r="0.7" fill="#FEF08A" />
                        <circle cx="0" cy="5" r="0.7" fill="#FEF08A" />
                      </g>
                    ))}
                  </g>
                )}

                {/* -------------------- CHERRIES -------------------- */}
                {hasCherries && (
                  <g id="decor-cherries">
                    {[
                      { x: 110, y: 172 },
                      { x: 155, y: 162 },
                      { x: 200, y: 158 },
                      { x: 245, y: 162 },
                      { x: 290, y: 172 }
                    ].map((ch, i) => (
                      <g key={i} transform={`translate(${ch.x}, ${ch.y})`}>
                        {/* Stem */}
                        <path d="M 0 -10 C -4 -25 6 -32 10 -36" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                        {/* Little leaf */}
                        <path d="M 8 -32 C 14 -34 16 -31 10 -36 Z" fill="#22C55E" />
                        {/* Cherry Orb with glossy specular highlight */}
                        <circle cx="0" cy="0" r="11" fill="#991B1B" />
                        <circle cx="0" cy="0" r="10.5" fill="#BE123C" />
                        <ellipse cx="-3.5" cy="-3.5" rx="3.5" ry="2.2" fill="#FFFFFF" opacity="0.85" transform="rotate(-30 -3.5 -3.5)" />
                      </g>
                    ))}
                  </g>
                )}

                {/* -------------------- CANDLES -------------------- */}
                {hasCandles && (
                  <g id="decor-candles">
                    {[
                      { x: 140, y: 168, c: '#3B82F6' },
                      { x: 180, y: 160, c: '#EC4899' },
                      { x: 220, y: 160, c: '#10B981' },
                      { x: 260, y: 168, c: '#F59E0B' }
                    ].map((cd, i) => (
                      <g key={i} transform={`translate(${cd.x}, ${cd.y})`}>
                        {/* Candle Stick */}
                        <rect x="-4" y="-36" width="8" height="38" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                        {/* Spiral Stripes */}
                        <path d="M -4 -30 L 4 -26 L 4 -22 L -4 -26 Z" fill={cd.c} />
                        <path d="M -4 -18 L 4 -14 L 4 -10 L -4 -14 Z" fill={cd.c} />
                        <path d="M -4 -6 L 4 -2 L 4 2 L -4 -2 Z" fill={cd.c} />
                        {/* Wick */}
                        <line x1="0" y1="-36" x2="0" y2="-42" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Outer Glow */}
                        <circle cx="0" cy="-48" r="14" fill="#FDE047" opacity="0.35" filter={`url(#candle-glow-${filterId})`} />
                        {/* Flame Outer */}
                        <path
                          d="M 0 -40 C -5 -45 -4 -54 0 -58 C 4 -54 5 -45 0 -40 Z"
                          fill="#F59E0B"
                        />
                        {/* Flame Core Inner */}
                        <path
                          d="M 0 -42 C -2.5 -46 -2 -52 0 -55 C 2 -52 2.5 -46 0 -42 Z"
                          fill="#FEF08A"
                        />
                      </g>
                    ))}
                  </g>
                )}

                {/* -------------------- BIRTHDAY TOPPER -------------------- */}
                {hasTopper && (
                  <g id="decor-topper" transform="translate(200, 150)">
                    {/* Stand sticks */}
                    <line x1="-30" y1="0" x2="-30" y2="-45" stroke="#D97706" strokeWidth="2.5" />
                    <line x1="30" y1="0" x2="30" y2="-45" stroke="#D97706" strokeWidth="2.5" />
                    {/* Acrylic Header Shield */}
                    <rect x="-80" y="-85" width="160" height="42" rx="10" fill="url(#gold-topper-)" stroke="#B45309" strokeWidth="1.5" />
                    {/* Sparkle star on topper */}
                    <path d="M -68 -64 L -65 -60 L -61 -64 L -65 -68 Z" fill="#FFF" />
                    <path d="M 68 -64 L 65 -60 L 61 -64 L 65 -68 Z" fill="#FFF" />
                    <text
                      x="0"
                      y="-60"
                      textAnchor="middle"
                      fill="#78350F"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="Playfair Display, serif"
                      letterSpacing="0.5"
                    >
                      HAPPY BIRTHDAY
                    </text>
                  </g>
                )}

                {/* -------------------- PIPED CAKE MESSAGE -------------------- */}
                {design.cakeMessage.trim() && (
                  <g id="piped-message" transform="translate(200, 218)">
                    {/* Background ribbon / contrast contour */}
                    <rect
                      x="-110"
                      y="-14"
                      width="220"
                      height="28"
                      rx="8"
                      fill={frostingHighlight}
                      opacity="0.75"
                    />
                    {/* Piped Text with drop shadow */}
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill={design.messageColor || '#2A1810'}
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="Playfair Display, cursive, serif"
                      letterSpacing="0.2"
                      style={{
                        filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.7))'
                      }}
                    >
                      {design.cakeMessage.trim()}
                    </text>
                  </g>
                )}
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VIEW MODE 2: TOP-DOWN VIEW (BIRD'S EYE DECORATING STATION) */}
          {/* ============================================================== */}
          {isTopView && (
            <g id="top-down-view">
              {/* Outer Plate Shadow */}
              <circle cx="200" cy="200" r="180" fill="#000000" opacity="0.1" />
              {/* Circular Ceramic Plate */}
              <circle cx="200" cy="200" r="175" fill="url(#plate-grad-)" stroke="#CFC0B2" strokeWidth="2.5" />
              <circle cx="200" cy="200" r="162" fill="#FAF7F2" stroke="#E3D5C8" strokeWidth="1" />

              {/* Dynamic Shape in Top-Down Projection */}
              <g transform={`translate(${200 * (1 - scale)}, ${200 * (1 - scale)}) scale(${scale})`}>
                {/* 1. TOP ROUND */}
                {design.shape === 'Round' && (
                  <g id="top-round">
                    <circle cx="200" cy="200" r="130" fill={frostingBase} stroke={frostingShadow} strokeWidth="3" />
                    {/* Inner highlight */}
                    <circle cx="200" cy="200" r="120" fill={`url(#frosting-top-${filterId})`} />
                    {/* Outer Rosette Border */}
                    {[...Array(24)].map((_, i) => {
                      const angle = (i * 360) / 24;
                      const rad = (angle * Math.PI) / 180;
                      const x = 200 + 125 * Math.cos(rad);
                      const y = 200 + 125 * Math.sin(rad);
                      return <circle key={i} cx={x} cy={y} r="8" fill={frostingHighlight} stroke={frostingShadow} strokeWidth="0.5" />;
                    })}
                  </g>
                )}

                {/* 2. TOP SQUARE */}
                {design.shape === 'Square' && (
                  <g id="top-square">
                    <rect x="80" y="80" width="240" height="240" rx="20" fill={frostingBase} stroke={frostingShadow} strokeWidth="3" />
                    <rect x="90" y="90" width="220" height="220" rx="14" fill={`url(#frosting-top-${filterId})`} />
                    {/* Corner rosettes */}
                    <circle cx="85" cy="85" r="10" fill={frostingHighlight} />
                    <circle cx="315" cy="85" r="10" fill={frostingHighlight} />
                    <circle cx="85" cy="315" r="10" fill={frostingHighlight} />
                    <circle cx="315" cy="315" r="10" fill={frostingHighlight} />
                  </g>
                )}

                {/* 3. TOP HEART */}
                {design.shape === 'Heart' && (
                  <g id="top-heart">
                    <path
                      d="M 200 320 C 100 230 40 180 70 110 C 95 60 160 70 200 120 C 240 70 305 60 330 110 C 360 180 300 230 200 320 Z"
                      fill={frostingBase}
                      stroke={frostingShadow}
                      strokeWidth="3"
                    />
                    <path
                      d="M 200 305 C 110 220 55 175 80 115 C 100 70 160 80 200 125 C 240 80 300 70 320 115 C 345 175 290 220 200 305 Z"
                      fill={`url(#frosting-top-${filterId})`}
                    />
                  </g>
                )}

                {/* TOP SPRINKLES */}
                {hasSprinkles && (
                  <g id="top-sprinkles">
                    {[...Array(30)].map((_, i) => {
                      const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
                      const c = colors[i % colors.length];
                      const randX = 120 + ((i * 37) % 160);
                      const randY = 120 + ((i * 53) % 160);
                      return (
                        <rect
                          key={i}
                          x={randX}
                          y={randY}
                          width="8"
                          height="3.5"
                          rx="1.7"
                          fill={c}
                          transform={`rotate(${(i * 47) % 180} ${randX} ${randY})`}
                        />
                      );
                    })}
                  </g>
                )}

                {/* TOP DRIZZLE */}
                {hasDrizzle && (
                  <g id="top-drizzle">
                    <path
                      d="M 100 140 Q 150 170 200 130 T 300 160 M 110 210 Q 160 250 200 200 T 290 240"
                      stroke="#261208"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.9"
                    />
                  </g>
                )}

                {/* TOP CHERRIES */}
                {hasCherries && (
                  <g id="top-cherries">
                    {[
                      { x: 130, y: 130 },
                      { x: 270, y: 130 },
                      { x: 130, y: 270 },
                      { x: 270, y: 270 },
                      { x: 200, y: 110 }
                    ].map((pt, i) => (
                      <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                        <circle cx="0" cy="0" r="12" fill="#991B1B" />
                        <circle cx="0" cy="0" r="11" fill="#BE123C" />
                        <circle cx="-3" cy="-3" r="3" fill="#FFF" opacity="0.8" />
                      </g>
                    ))}
                  </g>
                )}

                {/* TOP CANDLES */}
                {hasCandles && (
                  <g id="top-candles">
                    {[
                      { x: 150, y: 160 },
                      { x: 250, y: 160 },
                      { x: 160, y: 240 },
                      { x: 240, y: 240 }
                    ].map((pt, i) => (
                      <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                        <circle cx="0" cy="0" r="14" fill="#FEF08A" opacity="0.5" filter={`url(#candle-glow-${filterId})`} />
                        <circle cx="0" cy="0" r="6" fill="#F59E0B" />
                        <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                      </g>
                    ))}
                  </g>
                )}

                {/* TOP HEARTS */}
                {hasHearts && (
                  <g id="top-hearts">
                    {[
                      { x: 150, y: 130 },
                      { x: 250, y: 130 },
                      { x: 150, y: 260 },
                      { x: 250, y: 260 }
                    ].map((pt, i) => (
                      <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                        <path d="M 0 0 C -6 -6 -12 0 -4 6 L 0 10 L 4 6 C 12 0 6 -6 0 0 Z" fill="#E11D48" />
                      </g>
                    ))}
                  </g>
                )}

                {/* TOP MESSAGE */}
                {design.cakeMessage.trim() && (
                  <g id="top-message" transform="translate(200, 205)">
                    <rect
                      x="-110"
                      y="-18"
                      width="220"
                      height="36"
                      rx="10"
                      fill="#FFFFFF"
                      opacity="0.85"
                      stroke={frostingHighlight}
                    />
                    <text
                      x="0"
                      y="6"
                      textAnchor="middle"
                      fill={design.messageColor || '#2A1810'}
                      fontSize="16"
                      fontWeight="bold"
                      fontFamily="Playfair Display, cursive, serif"
                    >
                      {design.cakeMessage.trim()}
                    </text>
                  </g>
                )}
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Under-preview detail tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-stone-600">
        <span className="bg-white/80 border border-[#EADBCE] px-2.5 py-0.5 rounded-lg">
          Sponge: <strong className="text-stone-800">{design.sponge}</strong>
        </span>
        <span className="bg-white/80 border border-[#EADBCE] px-2.5 py-0.5 rounded-lg">
          Filling: <strong className="text-stone-800">{design.filling}</strong>
        </span>
        <span className="bg-white/80 border border-[#EADBCE] px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
          Frosting:
          <span
            className="w-3 h-3 rounded-full border border-stone-300 inline-block"
            style={{ backgroundColor: design.frostingColor }}
          />
          <strong className="text-stone-800">{design.frostingColorName}</strong>
        </span>
      </div>
    </div>
  );
}
