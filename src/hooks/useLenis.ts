import { useEffect, useRef } from 'react';

type LenisCallback = (scroll: number) => void;

/**
 * Hook to integrate with Lenis smooth scroll library.
 * Falls back to native scroll if Lenis is not available.
 */
export function useLenis(callback: LenisCallback) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        callback(scrollY);
      });
    };

    // Use native scroll for now (Lenis integration can be added later)
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [callback]);
}
