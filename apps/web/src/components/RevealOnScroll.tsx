import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'flip' | 'none';
  distance?: number; // px
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 32
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg)';
    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0) scale(0.97)`;
      case 'down': return `translate3d(0, -${distance}px, 0) scale(0.97)`;
      case 'left': return `translate3d(${distance}px, 0, 0) scale(0.97)`;
      case 'right': return `translate3d(-${distance}px, 0, 0) scale(0.97)`;
      case 'zoom': return 'translate3d(0, 20px, 0) scale(0.92)';
      case 'flip': return 'translate3d(0, 30px, 0) rotateX(15deg) scale(0.95)';
      default: return 'translate3d(0, 0, 0) scale(0.96)';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-800 ease-out will-change-[transform,opacity,filter] ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transform: getTransform(),
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}
    </div>
  );
};

