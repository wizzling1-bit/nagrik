'use client';

import React, { useId } from 'react';

export type PatternVariant = 
  | 'grid' 
  | 'blueprint'
  | 'dots' 
  | 'dot-grid'
  | 'diagonal' 
  | 'diagonal-lines'
  | 'ward-rings' 
  | 'hex-mesh';

interface GeometricPatternProps {
  variant: PatternVariant;
  className?: string;
  /** Optional container opacity override (0 to 1). */
  opacity?: number;
  /** Highlight with Nagrik Signature Brand Orange (#DE5227). Default false. */
  accent?: boolean;
  /** Edge fading mask. Default 'radial'. */
  fade?: 'radial' | 'top' | 'bottom' | 'none';
}

/**
 * High-craft geometric background pattern component.
 * Features crisp architectural grids, blueprint crossbars, geospatial dot matrices,
 * authentic 5km ward geofence radar circles, and network hex meshes.
 * Fully theme-aware across light (warm paper #F4EFE6) and dark (#0B0F17) modes.
 */
export const GeometricPattern: React.FC<GeometricPatternProps> = ({
  variant,
  className = '',
  opacity,
  accent = false,
  fade = 'radial',
}) => {
  const patternId = useId();

  const maskImage = {
    radial: 'radial-gradient(ellipse at 50% 50%, black 50%, transparent 95%)',
    top: 'linear-gradient(to bottom, black 25%, transparent 95%)',
    bottom: 'linear-gradient(to top, black 25%, transparent 95%)',
    none: undefined,
  }[fade];

  const maskStyle = maskImage
    ? { WebkitMaskImage: maskImage, maskImage }
    : {};

  const baseClasses = `absolute inset-0 pointer-events-none select-none z-0 ${className}`;
  const containerStyle: React.CSSProperties = {
    ...maskStyle,
    ...(opacity !== undefined ? { opacity } : {})
  };

  // ── 1. ARCHITECTURAL COORDINATE GRID ──
  if (variant === 'grid') {
    return (
      <div 
        className={`${baseClasses} bg-grid-pattern`} 
        style={containerStyle}
        aria-hidden="true" 
      />
    );
  }

  // ── 2. MAJOR/MINOR EDITORIAL BLUEPRINT GRID ──
  if (variant === 'blueprint') {
    return (
      <div 
        className={`${baseClasses} bg-blueprint-grid`} 
        style={containerStyle}
        aria-hidden="true" 
      />
    );
  }

  // ── 3. GEOSPATIAL DOT MATRIX (aliases 'dots' and 'dot-grid') ──
  if (variant === 'dots' || variant === 'dot-grid') {
    return (
      <div 
        className={`${baseClasses} bg-dots-pattern`} 
        style={containerStyle}
        aria-hidden="true" 
      />
    );
  }

  // ── 4. DIAGONAL CROSSHATCH (aliases 'diagonal' and 'diagonal-lines') ──
  if (variant === 'diagonal' || variant === 'diagonal-lines') {
    return (
      <div 
        className={`${baseClasses} bg-diagonal-pattern`} 
        style={containerStyle}
        aria-hidden="true" 
      />
    );
  }

  // ── 5. AUTHENTIC 5KM WARD GEOFENCE RADAR CIRCLES ──
  if (variant === 'ward-rings') {
    return (
      <div 
        className={baseClasses} 
        style={containerStyle} 
        aria-hidden="true"
      >
        <svg
          className="w-full h-full text-slate-900/25 dark:text-white/20"
          viewBox="0 0 1000 1000"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id={`glow-${patternId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DE5227" stopOpacity={accent ? 0.35 : 0.2} />
              <stop offset="55%" stopColor="#DE5227" stopOpacity={accent ? 0.1 : 0.04} />
              <stop offset="100%" stopColor="#DE5227" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Warm Ambient Illumination */}
          <circle cx="500" cy="500" r="420" fill={`url(#glow-${patternId})`} />

          {/* Concentric 5km Ward Distance Rings */}
          <circle cx="500" cy="500" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="500" cy="500" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="5 7" />
          <circle cx="500" cy="500" r="280" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 8" />
          <circle cx="500" cy="500" r="380" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 10" />
          <circle cx="500" cy="500" r="480" stroke="currentColor" strokeWidth="1" strokeDasharray="10 12" />

          {/* Signature Nagrik Brand Terracotta Geofence Perimeter Rings */}
          <circle cx="500" cy="500" r="280" stroke="#DE5227" strokeWidth="1.5" strokeDasharray="12 8" strokeOpacity="0.55" />
          <circle cx="500" cy="500" r="380" stroke="#DE5227" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Polar Cardinal & Intercardinal Navigation Axes */}
          <line x1="500" y1="20" x2="500" y2="980" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.6" />
          <line x1="20" y1="500" x2="980" y2="500" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.6" />
          <line x1="160" y1="160" x2="840" y2="840" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 9" strokeOpacity="0.4" />
          <line x1="840" y1="160" x2="160" y2="840" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 9" strokeOpacity="0.4" />

          {/* Radar Angle Tick Marks on Geofence Rings */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 500 + 270 * Math.cos(rad);
            const y1 = 500 + 270 * Math.sin(rad);
            const x2 = 500 + 290 * Math.cos(rad);
            const y2 = 500 + 290 * Math.sin(rad);
            return (
              <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#DE5227" strokeWidth="1.5" strokeOpacity="0.65" />
            );
          })}

          {/* Center Geospatial Radar Target Marker */}
          <circle cx="500" cy="500" r="16" fill="#DE5227" fillOpacity="0.2" stroke="#DE5227" strokeWidth="1.5" strokeOpacity="0.8" />
          <circle cx="500" cy="500" r="5" fill="#DE5227" />
        </svg>
      </div>
    );
  }

  // ── 6. ARCHITECTURAL HEXAGONAL NETWORK MESH ──
  if (variant === 'hex-mesh') {
    return (
      <div 
        className={baseClasses} 
        style={containerStyle} 
        aria-hidden="true"
      >
        <svg className="w-full h-full text-slate-900/20 dark:text-white/20" preserveAspectRatio="none">
          <defs>
            <pattern id={`hex-${patternId}`} width="60" height="104" patternUnits="userSpaceOnUse">
              <path
                d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M30 69.28 L60 86.6 L60 121.24 L30 138.56 L0 121.24 L0 86.6 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              {/* Subtle Brand Accent Interconnect Nodes */}
              <circle cx="30" cy="0" r="2.5" fill="#DE5227" fillOpacity="0.5" />
              <circle cx="60" cy="51.96" r="2.5" fill="#DE5227" fillOpacity="0.5" />
              <circle cx="0" cy="51.96" r="2.5" fill="#DE5227" fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hex-${patternId})`} />
        </svg>
      </div>
    );
  }

  return null;
};
