'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

  // Synchronize theme on initial mount
  useEffect(() => {
    let initialTheme: Theme = 'light';
    try {
      const storedTheme = localStorage.getItem('nagrik_theme') as Theme | null;
      if (storedTheme === 'dark' || storedTheme === 'light') {
        initialTheme = storedTheme;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initialTheme = 'dark';
      }
    } catch {
      // Storage unavailable in incognito/restricted mode
    }

    setThemeState(initialTheme);
    const root = document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    setMounted(true);
  }, []);

  const applyThemeClass = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  const setTheme = useCallback((newTheme: Theme, event?: React.MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('nagrik_theme', newTheme);
    } catch {
      // Storage unavailable
    }

    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document && typeof (document as any).startViewTransition === 'function';

    if (hasViewTransition && !isReducedMotion) {
      // Determine origin coordinates for circular wave transition
      let x = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      let y = 40;

      if (event && 'clientX' in event && typeof event.clientX === 'number') {
        x = event.clientX;
        y = event.clientY;
      }

      try {
        const transition = (document as any).startViewTransition(() => {
          applyThemeClass(newTheme);
        });

        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        if (transition && transition.ready) {
          transition.ready.then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`
                ]
              },
              {
                duration: 380,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
              }
            );
          }).catch(() => {
            // Ignore animation failure
          });
        }
      } catch {
        applyThemeClass(newTheme);
      }
    } else {
      // Smooth subtle CSS fallback on root/body without universal selector lag
      const root = document.documentElement;
      root.classList.add('theme-fade-fallback');
      applyThemeClass(newTheme);
      window.setTimeout(() => {
        root.classList.remove('theme-fade-fallback');
      }, 250);
    }
  }, []);

  const toggleTheme = useCallback((event?: React.MouseEvent<HTMLElement> | { clientX: number; clientY: number }) => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, event);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
