import React from 'react';

interface NagrikLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'icon';
  theme?: 'light' | 'dark';
  hideSubtitle?: boolean;
  className?: string;
}

export const NagrikLogo: React.FC<NagrikLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'light',
  hideSubtitle = false,
  className = ''
}) => {
  const iconDimensions = {
    sm: { width: 30, height: 34, viewBox: '0 0 100 112' },
    md: { width: 38, height: 42, viewBox: '0 0 100 112' },
    lg: { width: 48, height: 54, viewBox: '0 0 100 112' },
    xl: { width: 64, height: 72, viewBox: '0 0 100 112' }
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const subtextColor = theme === 'dark' ? 'text-stone-400' : 'text-stone-500';

  const BrandIcon = (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox={iconDimensions.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs transition-transform hover:scale-105 duration-200"
      >
        {/* Main Squircle Container */}
        <rect x="5" y="4" width="90" height="84" rx="26" fill="url(#nagrik_brand_grad)" />
        
        {/* Bottom Pointer Triangle */}
        <path d="M50 100 L41 87 L59 87 Z" fill="#D9562B" />
        
        {/* Signal Radio Arcs */}
        <path
          d="M66 28 C70 32 72 38 72 45 C72 52 70 57 66 61"
          stroke="#FEE7DE"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M75 20 C83 26 86 35 86 45 C86 55 83 64 75 70"
          stroke="#FEE7DE"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        
        {/* Bold N Glyph */}
        <path
          d="M27 30 L27 68 M27 30 L64 68 M64 30 L64 68"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        
        {/* Tricolor Accent Base Dots */}
        <rect x="33" y="104" width="9" height="4" rx="2" fill="#F58220" />
        <rect x="45.5" y="104" width="9" height="4" rx="2" fill="#CBD5E1" />
        <rect x="58" y="104" width="9" height="4" rx="2" fill="#22C55E" />
        
        <defs>
          <linearGradient id="nagrik_brand_grad" x1="5" y1="4" x2="95" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>{BrandIcon}</div>;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {BrandIcon}
        <div className="mt-2">
          <span className={`block font-black tracking-tight ${textSize} ${textColor}`}>
            nagrik<span className="text-[#E36138]">.news</span>
          </span>
          {!hideSubtitle && (
            <span className={`block text-[11px] font-medium mt-0.5 tracking-wide ${subtextColor}`}>
              Citizen Journalism Platform
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {BrandIcon}
      <div className="flex flex-col leading-tight">
        <span className={`font-black tracking-tight ${textSize} ${textColor}`}>
          nagrik<span className="text-[#E36138]">.news</span>
        </span>
        {!hideSubtitle && (
          <span className={`text-[10px] font-semibold tracking-wide ${subtextColor}`}>
            Citizen Journalism Platform
          </span>
        )}
      </div>
    </div>
  );
};



