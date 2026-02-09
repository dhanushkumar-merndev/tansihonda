"use client";

import { useCallback, useRef } from 'react';

/**
 * Hook to prefetch a PDF into the browser's cache on hover.
 * This makes the actual navigation feel instant because the file is already stored in memory/disk.
 */
export function usePdfPrefetch() {
  const prefetchedUrls = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<number | null>(null);

  const prefetch = useCallback((path: string) => {
    const pdfUrl = `/${path}`; // Direct path to public folder
    
    // Only prefetch once per session per URL
    if (prefetchedUrls.current.has(pdfUrl)) return;

    // Clear any pending prefetch
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Debounce: Wait 500ms before fetching
    timeoutRef.current = setTimeout(() => {
      // 1. Prefetch the PDF file itself
      fetch(pdfUrl, { priority: 'low' })
        .then(() => {
          prefetchedUrls.current.add(pdfUrl);
        })
        .catch(() => {});

      // 2. Prefetch PDF.js Viewer Assets (Critical for first-time load)
      // These are only prefetched once per session
      const viewerAssets = [
        '/pdfjs/web/viewer.mjs',
        '/pdfjs/build/pdf.worker.mjs',
        '/pdfjs/build/pdf.mjs',
        '/pdfjs/web/viewer.css'
      ];

      viewerAssets.forEach(asset => {
        if (!prefetchedUrls.current.has(asset)) {
          fetch(asset, { priority: 'low' })
            .then(() => prefetchedUrls.current.add(asset))
            .catch(() => {});
        }
      });
    }, 500) as any as number;
  }, []);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { prefetch, cancelPrefetch };
}
