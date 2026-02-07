"use client";

import { useCallback, useRef } from 'react';

/**
 * Hook to prefetch a PDF into the browser's cache on hover.
 * This makes the actual navigation feel instant because the file is already stored in memory/disk.
 */
export function usePdfPrefetch() {
  const prefetchedUrls = useRef<Set<string>>(new Set());

  const prefetch = useCallback((path: string) => {
    const proxyUrl = `/api/pdf-proxy/${path}`;
    
    // Only prefetch once per session per URL
    if (prefetchedUrls.current.has(proxyUrl)) return;

    // Use low priority fetch for prefetching
    fetch(proxyUrl, { priority: 'low' })
      .then(() => {
        prefetchedUrls.current.add(proxyUrl);
        console.log(`Prefetched: ${proxyUrl}`);
      })
      .catch((err) => console.warn(`Prefetch failed for ${proxyUrl}`, err));
  }, []);

  return { prefetch };
}
