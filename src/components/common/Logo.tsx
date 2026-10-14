import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Symbol of Stability, Growth and Financial Mastery */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(16,185,129,0.35)]"
        >
          <defs>
            <linearGradient id="finovaGrad1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="finovaGrad2" x1="48" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="finovaDiamond" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Hexagonal Base of Financial Stability */}
          <path
            d="M24 3L42 13.5V34.5L24 45L6 34.5V13.5L24 3Z"
            fill="#111C2E"
            stroke="url(#finovaGrad1)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Ascending Growth Facet */}
          <path
            d="M24 10L36 17V31L24 38L12 31V17L24 10Z"
            fill="url(#finovaGrad2)"
            fillOpacity="0.25"
            stroke="url(#finovaGrad2)"
            strokeWidth="1.75"
          />

          {/* Upward Growth Arrow & Precision Diamond */}
          <path
            d="M24 12V32M24 12L17 19M24 12L31 19"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="32" r="2.5" fill="#34D399" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight font-sans ${textSizes[size]} leading-none`}>
          <span className="text-slate-900 dark:text-white">Finova</span>
          <span className="text-emerald-500 font-semibold ml-1">Finance</span>
        </div>
        {showSlogan && (
          <span className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-1">
            Votre argent. Votre vision. Votre avenir.
          </span>
        )}
      </div>
    </div>
  );
};
