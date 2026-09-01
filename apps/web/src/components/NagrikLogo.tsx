import React from 'react';

interface NagrikLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
}

export const NagrikLogo: React.FC<NagrikLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'light',
  className = ''
}) => {
  const iconDimensions = {
    sm: { width: 32, height: 36, viewBox: '0 0 100 112' },
    md: { width: 44, height: 50, viewBox: '0 0 100 112' },
    lg: { width: 64, height: 72, viewBox: '0 0 100 112' },
    xl: { width: 90, height: 102, viewBox: '0 0 100 112' }
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subtextColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  const LogoIcon = (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox={iconDimensions.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm transition-transform hover:scale-105 duration-200"
      >
        <rect x="5" y="4" width="90" height="84" rx="28" fill="url(#web_saffron_grad)" />
        <path d="M50 104 L41 87 L59 87 Z" fill="#D9562B" />
        <path
          d="M66 28 C70 32 72 38 72 45 C72 52 70 57 66 61"
          stroke="#FEE7DE"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M74 21 C81 27 84 36 84 45 C84 54 81 63 74 69"
          stroke="#FEE7DE"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M27 30 L27 68 M27 30 L64 68 M64 30 L64 68"
          stroke="#FFF6F2"
          strokeWidth="11.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <rect x="33" y="107" width="9" height="4.5" rx="2.25" fill="#F58220" />
        <rect x="45.5" y="107" width="9" height="4.5" rx="2.25" fill="#CBD5E1" />
        <rect x="58" y="107" width="9" height="4.5" rx="2.25" fill="#388E3C" />
        <defs>
          <linearGradient id="web_saffron_grad" x1="5" y1="4" x2="95" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E36138" />
            <stop offset="100%" stopColor="#D24E25" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {LogoIcon}
        <div className="mt-3">
          <span className={`block font-extrabold tracking-tight font-sans text-2xl md:text-3xl ${textColor}`}>
            nagrik
          </span>
          <span className={`block text-xs md:text-sm font-medium mt-0.5 tracking-wide ${subtextColor}`}>
            आपकी आवाज़, हर खबर
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoIcon}
      <div className="flex flex-col">
        <span className={`font-black tracking-tight leading-none text-xl md:text-2xl ${textColor}`}>
          nagrik
        </span>
        <span className={`text-[11px] md:text-xs font-semibold leading-tight mt-1 tracking-wide ${subtextColor}`}>
          आपकी आवाज़, हर खबर
        </span>
      </div>
    </div>
  );
};
