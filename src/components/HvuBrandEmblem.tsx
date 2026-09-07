import React from 'react';

interface HvuBrandEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
  subTitle?: string;
}

export const HvuBrandEmblem: React.FC<HvuBrandEmblemProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'light',
  subTitle
}) => {
  const iconSizeClass = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* HVU Emblem Logo Badge */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizeClass}`}>
        {/* Outer Hexagon/Shield with HVU Blue and Gold Border */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="hvuShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#005BAC" />
              <stop offset="60%" stopColor="#003B73" />
              <stop offset="100%" stopColor="#002147" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#F5B400" />
              <stop offset="100%" stopColor="#D99B00" />
            </linearGradient>
            <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF333A" />
              <stop offset="100%" stopColor="#D71920" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#00A6D6" />
            </linearGradient>
          </defs>

          {/* Background Shield */}
          <polygon
            points="50,4 92,24 92,68 50,96 8,68 8,24"
            fill="url(#hvuShieldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Digital Tech Circuit Rings */}
          <circle cx="50" cy="50" r="34" fill="none" stroke="url(#cyanGrad)" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="url(#cyanGrad)" strokeWidth="1" opacity="0.4" />
          
          {/* Tech Nodes */}
          <circle cx="50" cy="16" r="2" fill="#00A6D6" />
          <circle cx="84" cy="50" r="2" fill="#00A6D6" />
          <circle cx="16" cy="50" r="2" fill="#00A6D6" />
          <circle cx="50" cy="84" r="2" fill="#00A6D6" />

          {/* Dong Son Sun Symbol (Bronze Drum Center - 12 Rays) */}
          <circle cx="50" cy="50" r="16" fill="url(#goldGrad)" />
          
          {/* Heritage Symbol & Star */}
          <path
            d="M38,44 L44,48 L50,38 L56,48 L62,44 L59,57 L41,57 Z"
            fill="#003B73"
          />
          <polygon
            points="50,43 51.5,47 56,47 52.5,49.5 54,54 50,51 46,54 47.5,49.5 44,47 48.5,47"
            fill="#FFFFFF"
          />

          {/* National Ribbon Accent */}
          <path
            d="M26,72 Q50,64 74,72 L70,82 Q50,75 30,82 Z"
            fill="url(#redGrad)"
            stroke="#FFE066"
            strokeWidth="1"
          />
          <text
            x="50"
            y="79"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="sans-serif"
            letterSpacing="1"
          >
            HAEWS
          </text>
        </svg>

        {/* Live Digital Pulse Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      </div>

      {/* Clean, Elegant Brand Typography (No extra badge clutter) */}
      {showText && (
        <div className="flex flex-col justify-center shrink-0 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-base sm:text-lg leading-none ${
                isDark ? 'text-white' : 'text-[#003B73]'
              }`}
            >
              HAEWS-HVU
            </span>
          </div>

          <div className="text-[12px] font-bold text-slate-700 dark:text-slate-200 tracking-tight mt-0.5 leading-tight whitespace-nowrap">
            HỆ THỐNG CẢNH BÁO SỚM THIÊN TAI ĐA NGUY CƠ
          </div>
        </div>
      )}
    </div>
  );
};
