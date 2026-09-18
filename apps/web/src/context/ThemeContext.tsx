'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => void;
  setTheme: (theme: Theme, event?: React.MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check local storage or system preference
    const storedTheme = localStorage.getItem('nagrik_theme') as Theme | null;
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
      applyTheme('dark');
    } else {
      setThemeState('light');
      applyTheme('light');
    }
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Add smooth theme transition class for fallback animations
    root.classList.add('theme-transitioning');
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Clean up temporary transition class after transition finishes
    window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 420);
  };

  const setTheme = (newTheme: Theme, event?: React.MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => {
    setThemeState(newTheme);
    localStorage.setItem('nagrik_theme', newTheme);
    
    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document && typeof (document as any).startViewTransition === 'function';

    if (hasViewTransition && !isReducedMotion) {
      const root = document.documentElement;
      let x = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      let y = 40;

      if (event && 'clientX' in event && typeof event.clientX === 'number') {
        x = event.clientX;
        y = event.clientY;
      }

      root.classList.add('theme-transition-circular');

      try {
        const transition = (document as any).startViewTransition(() => {
          applyTheme(newTheme);
        });

        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        if (transition && transition.ready) {
          transition.ready.then(() => {
            const anim = root.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`
                ]
              },
              {
                duration: 450,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
              }
            );

            anim.onfinish = () => {
              root.classList.remove('theme-transition-circular');
            };
          }).catch(() => {
            root.classList.remove('theme-transition-circular');
          });
        }

        if (transition && transition.finished) {
          transition.finished.then(() => {
            root.classList.remove('theme-transition-circular');
          }).catch(() => {
            root.classList.remove('theme-transition-circular');
          });
        }
      } catch {
        root.classList.remove('theme-transition-circular');
        applyTheme(newTheme);
      }
    } else {
      applyTheme(newTheme);
    }
  };

  const toggleTheme = (event?: React.MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, event);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
