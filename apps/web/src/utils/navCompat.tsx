'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from 'next/link';

export function useLocation() {
  const pathname = usePathname() || '/';
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search || '');
    }
  }, [pathname]);

  return {
    pathname,
    search,
    hash: '',
    state: null,
    key: 'default'
  };
}

export function useNavigate() {
  const router = useRouter();
  return React.useCallback((to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined' && to === -1) {
        window.history.back();
      }
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router]);
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, children, className, ...props }, ref) => {
  return (
    <NextLink href={to || '/'} className={className} ref={ref} {...props}>
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
}
