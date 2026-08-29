import React from 'react';

/**
 * Custom Unique FarmDirect Emblem & Logo Component
 * Features an abstract fusion of Rising Morning Sun, Organic Harvest Leaf, and Farm Field Curves.
 */
const Logo = ({ size = 'md', showText = true, variant = 'dark' }) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[8px]' },
    md: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-[9.5px]' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-[11px]' },
    xl: { icon: 'w-24 h-24', text: 'text-5xl', sub: 'text-[14px]' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 group select-none cursor-pointer">
      {/* Handcrafted Custom SVG Emblem */}
      <div className={`relative ${currentSize.icon} shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Outer Badge Gradient */}
            <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#05472A" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Sun Glow Gradient */}
            <radialGradient id="sunGlow" cx="50%" cy="35%" r="40%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="1" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>

            {/* Main Leaf Gradient */}
            <linearGradient id="leafGrad" x1="20%" y1="80%" x2="80%" y2="10%">
              <stop offset="0%" stopColor="#065F46" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>

            {/* Field Furrows Gradient */}
            <linearGradient id="fieldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Soft Shadow Filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#059669" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Rounded Square Badge Background */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="28"
            fill="url(#badgeGrad)"
            filter="url(#softGlow)"
          />

          {/* Inner Shield Overlay */}
          <rect
            x="7"
            y="7"
            width="86"
            height="86"
            rx="25"
            fill="#064E3B"
            fillOpacity="0.25"
            stroke="white"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />

          {/* Golden Rising Sun */}
          <circle cx="50" cy="42" r="24" fill="url(#sunGlow)" />
          <circle cx="50" cy="42" r="14" fill="#FBBF24" />

          {/* Stylized Farm Field Furrows (Bottom Curves) */}
          <path
            d="M 16 72 Q 35 60 50 72 Q 65 84 84 72 L 84 80 Q 65 92 50 80 Q 35 68 16 80 Z"
            fill="url(#fieldGrad)"
            opacity="0.9"
          />
          <path
            d="M 20 64 Q 38 52 50 64 Q 62 76 80 64"
            stroke="#A7F3D0"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />

          {/* Hero Organic Leaf & Sprout */}
          <path
            d="M 50 18 C 30 32 30 64 50 78 C 70 64 70 32 50 18 Z"
            fill="url(#leafGrad)"
          />

          {/* Leaf Vein Center Swoosh */}
          <path
            d="M 50 74 Q 49 46 60 28"
            stroke="#ECFDF5"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Small Organic Dew Drop Accent */}
          <circle cx="57" cy="34" r="3.5" fill="#FEF08A" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} font-black tracking-tight font-sans leading-none ${
            variant === 'light' ? 'text-white' : 'text-slate-900'
          }`}>
            Fresh<span className="bg-gradient-to-r from-emerald-600 via-brand-600 to-amber-500 bg-clip-text text-transparent">Blink</span>
          </span>
          <span className={`${currentSize.sub} font-black uppercase tracking-widest text-emerald-800 font-sans mt-1 leading-none flex items-center gap-1`}>
            ⚡ 10-Min Grocery Mart
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
