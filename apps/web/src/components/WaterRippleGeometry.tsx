'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  wavelength: number;
  speed: number;
  decay: number;
}

export const WaterRippleGeometry: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active water ripples list
  const ripplesRef = useRef<Ripple[]>([]);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | null>(null);

  // Function to drop a "stone" into the water geometry
  const dropStone = (x: number, y: number, isMajor: boolean = false) => {
    const ripples = ripplesRef.current;
    // Limit active ripples to prevent lag (up to 12 concurrent waves)
    if (ripples.length > 12) {
      ripples.shift();
    }

    if (isMajor) {
      // Major stone impact (concentric ripples)
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.75,
        amplitude: 22,
        wavelength: 60,
        speed: 4.8,
        decay: 0.985,
      });
      // Trailing secondary ring
      setTimeout(() => {
        ripplesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.6,
          amplitude: 14,
          wavelength: 45,
          speed: 4.2,
          decay: 0.98,
        });
      }, 90);
    } else {
      // Gentle hover / movement ripple
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: 280,
        amplitude: 10,
        wavelength: 45,
        speed: 3.8,
        decay: 0.97,
      });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Initial drop in the center like a stone dropped into calm water
    dropStone(width * 0.5, height * 0.4, true);

    // Mouse movement / hover handler
    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const dist = Math.hypot(dx, dy);

      // Create a gentle ripple wake every 20px of cursor movement
      if (dist > 20) {
        lastMousePos.current = { x, y };
        dropStone(x, y, false);
      }
    };

    // Click creates a major stone splash ripple with 3 concentric rings!
    const handleClick = (e: MouseEvent) => {
      dropStone(e.clientX, e.clientY, true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Grid configuration
    const spacing = 40; // Geometric grid cell size in px

    const render = () => {
      const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
      ctx.clearRect(0, 0, width, height);

      // 1. Draw background surface
      ctx.fillStyle = isDark ? '#0B0F17' : '#F4EFE6';
      ctx.fillRect(0, 0, width, height);

      const ripples = ripplesRef.current;

      // Update ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += ripple.speed;
        ripple.amplitude *= ripple.decay;

        if (ripple.radius > ripple.maxRadius || ripple.amplitude < 0.2) {
          ripples.splice(r, 1);
        }
      }

      // Generate grid vertices and apply water ripple radial displacement
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      // Compute displaced grid coordinates and wave crest heights
      const gridPoints: { x: number; y: number; h: number }[][] = [];

      for (let i = 0; i <= rows; i++) {
        gridPoints[i] = [];
        const baseY = i * spacing;

        for (let j = 0; j <= cols; j++) {
          const baseX = j * spacing;
          let dispX = 0;
          let dispY = 0;
          let crestH = 0;

          // Calculate displacement from all active water ripples
          for (let r = 0; r < ripples.length; r++) {
            const ripple = ripples[r];
            const dx = baseX - ripple.x;
            const dy = baseY - ripple.y;
            const dist = Math.hypot(dx, dy);

            const distFromWave = dist - ripple.radius;
            if (Math.abs(distFromWave) < ripple.wavelength) {
              const phase = (distFromWave / ripple.wavelength) * Math.PI;
              // Cosine packet envelope
              const envelope = Math.cos(phase) * (0.5 + 0.5 * Math.cos(phase));
              const h = ripple.amplitude * envelope;

              if (dist > 0.01) {
                const nx = dx / dist;
                const ny = dy / dist;
                dispX += nx * h * 1.4;
                dispY += ny * h * 1.4;
              }
              crestH += Math.max(0, h);
            }
          }

          gridPoints[i][j] = {
            x: baseX + dispX,
            y: baseY + dispY,
            h: crestH,
          };
        }
      }

      // 2. Draw Geometric Grid Lines with Water Undulation
      const defaultLineColor = isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(15, 23, 42, 0.11)';
      const waveLineColor = isDark ? 'rgba(222, 82, 39, 0.75)' : 'rgba(222, 82, 39, 0.65)';

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        for (let j = 0; j <= cols; j++) {
          const pt = gridPoints[i][j];
          if (j === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = defaultLineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vertical lines
      for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        for (let i = 0; i <= rows; i++) {
          const pt = gridPoints[i][j];
          if (i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = defaultLineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Highlight Wave Crests & Intersections with Luminous Brand Saffron Glow
      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          const pt = gridPoints[i][j];

          // If a water wave is passing through this vertex, draw a glowing ripple node
          if (pt.h > 0.8) {
            const intensity = Math.min(pt.h / 10, 1);
            const radius = 2 + intensity * 3.5;

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark
              ? `rgba(222, 82, 39, ${0.5 + intensity * 0.5})`
              : `rgba(222, 82, 39, ${0.45 + intensity * 0.5})`;
            ctx.fill();

            // Accent crest stroke
            if (j < cols) {
              const nextPt = gridPoints[i][j + 1];
              if (nextPt.h > 0.8) {
                ctx.beginPath();
                ctx.moveTo(pt.x, pt.y);
                ctx.lineTo(nextPt.x, nextPt.y);
                ctx.strokeStyle = waveLineColor;
                ctx.lineWidth = 1.8;
                ctx.stroke();
              }
            }
          } else {
            // Subtle resting geometric dot at alternate grid intersections
            if ((i + j) % 2 === 0) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.14)';
              ctx.fill();
            }
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [theme]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
};
