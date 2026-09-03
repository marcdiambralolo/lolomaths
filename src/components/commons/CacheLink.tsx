'use client';
import { prefetchRouteData } from '@/lib/cache/route-prefetch';
import { useAuth } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';

type NextLinkProps = ComponentPropsWithoutRef<typeof Link>;

interface CacheLinkProps extends Omit<NextLinkProps, 'href' | 'children'> {
  href: string;
  children: ReactNode;
  disableCacheBusting?: boolean;
  customTimestamp?: number;
}

const addCacheBusting = (url: string, timestamp?: number): string => {
  if (url.startsWith('http') || url.startsWith('//') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }

  const bustTimestamp = timestamp || Date.now();
  const separator = url.includes('?') ? '&' : '?';

  if (url.includes('_cb=')) {
    return url.replace(/_cb=\d+/, `_cb=${bustTimestamp}`);
  }

  return `${url}${separator}_cb=${bustTimestamp}`;
};

const getSessionTimestamp = (): number => {
  return Math.floor(Date.now() / 300000) * 300000;
};

export default function CacheLink({
  href,
  children,
  className,
  disableCacheBusting = false,
  customTimestamp,
  ...props
}: CacheLinkProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const bustedHref = useMemo(() => {
    if (disableCacheBusting) return href;

    const [baseUrl, hash] = href.split('#');
    const urlWithCache = addCacheBusting(baseUrl, customTimestamp || getSessionTimestamp());
    return hash ? `${urlWithCache}#${hash}` : urlWithCache;
  }, [href, disableCacheBusting, customTimestamp]);

  const prefetchHref = useMemo(() => {
    return href.replace(/[?&]_cb=\d+/, '').replace(/[?&]$/, '');
  }, [href]);

  const handlePrefetch = useCallback(() => {
    if (props.prefetch === false) {
      return;
    }
    void router.prefetch(prefetchHref);
    void prefetchRouteData(queryClient, prefetchHref, isAuthenticated);
  }, [prefetchHref, isAuthenticated, props.prefetch, queryClient, router]);

  const handleMouseEnter = useCallback<NonNullable<CacheLinkProps['onMouseEnter']>>((event) => {
    props.onMouseEnter?.(event);
    handlePrefetch();
  }, [handlePrefetch, props]);

  const handleFocus = useCallback<NonNullable<CacheLinkProps['onFocus']>>((event) => {
    props.onFocus?.(event);
    handlePrefetch();
  }, [handlePrefetch, props]);

  const handleTouchStart = useCallback<NonNullable<CacheLinkProps['onTouchStart']>>((event) => {
    props.onTouchStart?.(event);
    handlePrefetch();
  }, [handlePrefetch, props]);

  return (
    <Link
      href={bustedHref}
      className={className}
      {...props}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
    >
      {children}
    </Link>
  );
}