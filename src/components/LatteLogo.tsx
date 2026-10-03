import React from 'react';

interface LatteLogoProps {
  className?: string;
  size?: number;
}

export const LatteLogo: React.FC<LatteLogoProps> = ({ 
  className = "w-10 h-10", 
  size = 48 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 512 512" 
        width="100%" 
        height="100%" 
        className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-300"
      >
        <defs>
          {/* Background Gradient */}
          <radialGradient id="latteBgGrad" cx="50%" cy="50%" r="65%" fx="45%" fy="45%">
            <stop offset="0%" stopColor="#15243b" />
            <stop offset="60%" stopColor="#0d1728" />
            <stop offset="100%" stopColor="#060b13" />
          </radialGradient>

          {/* Outer Gold Frame Gradient */}
          <linearGradient id="latteGoldFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE08B" />
            <stop offset="25%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>

          {/* Inner Metallic Rim Gradient */}
          <linearGradient id="latteInnerRim" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="40%" stopColor="#B45309" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          {/* Glowing Cup Neon Gradient */}
          <linearGradient id="latteCupGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="latteNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Metallic Gold Rounded Frame */}
        <rect 
          x="28" 
          y="28" 
          width="456" 
          height="456" 
          rx="112" 
          fill="none" 
          stroke="url(#latteGoldFrame)" 
          strokeWidth="26" 
        />

        {/* Inner Dark Blue Circuit Board Base */}
        <rect 
          x="42" 
          y="42" 
          width="428" 
          height="428" 
          rx="98" 
          fill="url(#latteBgGrad)" 
          stroke="url(#latteInnerRim)" 
          strokeWidth="4" 
        />

        {/* Circuit Board Decorative Micro-Traces (PCB lines) */}
        <g stroke="#264166" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
          <path d="M 68 140 H 120 L 150 170 V 210" />
          <path d="M 120 70 V 110 L 160 150 H 180" />
          <path d="M 80 200 H 130 L 160 230" />
          <path d="M 70 280 H 110 L 140 250 V 230" />
          <path d="M 444 140 H 392 L 362 170 V 200" />
          <path d="M 392 70 V 110 L 352 150 H 332" />
          <path d="M 432 200 H 382 L 360 222" />
          <path d="M 70 340 H 130 L 160 370 H 180" />
          <path d="M 120 442 V 400 L 150 370" />
          <path d="M 90 390 H 130 L 170 430" />
          <path d="M 190 442 V 410 L 220 380" />
          <path d="M 442 340 H 382 L 352 370 H 332" />
          <path d="M 392 442 V 400 L 362 370" />
          <path d="M 422 390 H 382 L 342 430" />
          <path d="M 322 442 V 410 L 292 380" />
          <path d="M 160 80 Q 200 110 240 80" />
          <path d="M 272 80 Q 312 110 352 80" />
          <path d="M 180 430 Q 256 400 332 430" />
        </g>

        {/* Circuit Solder Nodes / Dots */}
        <g fill="#F59E0B" opacity="0.65">
          <circle cx="150" cy="210" r="4.5" />
          <circle cx="180" cy="150" r="4.5" />
          <circle cx="160" cy="230" r="4" />
          <circle cx="362" cy="200" r="4.5" />
          <circle cx="332" cy="150" r="4.5" />
          <circle cx="180" cy="370" r="4" />
          <circle cx="332" cy="370" r="4" />
          <circle cx="220" cy="380" r="4" />
          <circle cx="292" cy="380" r="4" />
        </g>

        {/* Central Glowing Golden Coffee Cup & Steam */}
        <g filter="url(#latteNeonGlow)">
          {/* 3 Steam Curves */}
          <g stroke="url(#latteCupGold)" strokeWidth="18" strokeLinecap="round" fill="none">
            <path d="M 218 208 C 210 190, 224 175, 216 152 C 214 146, 218 136, 215 130" />
            <path d="M 264 208 C 256 190, 270 175, 262 152 C 260 146, 264 136, 261 130" />
            <path d="M 310 208 C 302 190, 316 175, 308 152 C 306 146, 310 136, 307 130" />
          </g>

          {/* Cup Body */}
          <path 
            d="M 184 236 H 344 V 298 C 344 338, 314 366, 264 366 C 214 366, 184 338, 184 298 Z" 
            fill="none" 
            stroke="url(#latteCupGold)" 
            strokeWidth="19" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Cup Handle */}
          <path 
            d="M 344 250 C 388 250, 412 274, 412 298 C 412 324, 386 346, 344 346" 
            fill="none" 
            stroke="url(#latteCupGold)" 
            strokeWidth="18" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>

        {/* Extra Center Highlight */}
        <g stroke="#FFFBEB" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M 194 242 H 334" />
          <path d="M 262 204 C 258 190, 268 178, 262 154" />
        </g>
      </svg>
    </div>
  );
};
