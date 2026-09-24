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
  const iconPixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
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
    <div
      className="relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-xs hover:scale-105 transition-transform duration-200"
      style={{ width: iconPixelSizes, height: iconPixelSizes }}
    >
      <img
        src="/nagrik-logo.png"
        alt="Nagrik Logo"
        width={iconPixelSizes}
        height={iconPixelSizes}
        className="w-full h-full object-contain rounded-2xl"
      />
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
            nagrik<span className="text-[#DE5227]">.news</span>
          </span>
          {!hideSubtitle && (
            <span className={`block text-xs font-medium mt-0.5 tracking-wide ${subtextColor}`}>
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
          nagrik<span className="text-[#DE5227]">.news</span>
        </span>
        {!hideSubtitle && (
          <span className={`text-xs font-semibold tracking-wide ${subtextColor}`}>
            Citizen Journalism Platform
          </span>
        )}
      </div>
    </div>
  );
};




