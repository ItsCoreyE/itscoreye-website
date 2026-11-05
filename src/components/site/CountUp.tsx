'use client';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  value: number;
  decimals?: number;
  duration?: number; // ms
  className?: string;
  gradient?: boolean; // paint the digits with .gradient-text
}

const format = (value: number, decimals: number) =>
  value.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Counts from zero to `value` the first time it scrolls into view. The server
// renders the final number, an invisible copy reserves its width so nothing
// shifts while counting, and screen readers only ever get the final value.
export default function CountUp({ value, decimals = 0, duration = 1600, className, gradient = false }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    element.textContent = format(0, decimals);
    let frame = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        element.textContent = format(value * eased, decimals);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = format(value, decimals);
    };
  }, [value, decimals, duration]);

  const final = format(value, decimals);

  return (
    <span className={`relative inline-block tabular-nums ${className ?? ''}`}>
      <span className="invisible">{final}</span>
      {/* background-clip: text does not reach positioned children, so the
          gradient is applied to the animated layer itself */}
      <span ref={ref} aria-hidden className={gradient ? 'gradient-text absolute inset-0' : 'absolute inset-0'}>
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
