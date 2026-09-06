import React, { useState, useRef } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt angle in degrees (default 12)
  glare?: boolean;
  borderGlow?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 12,
  glare = true,
  borderGlow = false,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;
    
    setRotateX(rX);
    setRotateY(rY);
    
    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.35
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`perspective-1000 transition-transform duration-200 ease-out group ${className}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className={`w-full h-full relative preserve-3d transition-transform duration-150 ease-out rounded-2xl ${
          borderGlow ? 'before:absolute before:-inset-[1px] before:rounded-2xl before:bg-gradient-to-r before:from-[#E15024]/40 before:via-amber-500/40 before:to-[#E15024]/40 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:-z-10 before:blur-xs' : ''
        }`}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          boxShadow: isHovered
            ? '0 30px 60px -15px rgba(0, 0, 0, 0.2), 0 0 40px rgba(225, 80, 36, 0.15)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
        }}
      >
        {children}

        {/* Specular 3D Glare Reflection */}
        {glare && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 overflow-hidden z-20"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 75%)`
            }}
          />
        )}
      </div>
    </div>
  );
};

