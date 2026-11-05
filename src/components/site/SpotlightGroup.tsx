'use client';
import type { PointerEvent, ReactNode } from 'react';

// One delegated pointer listener for a group of .spotlight cards: it moves the
// soft brand glow under the cursor. Mouse only, so touch devices are untouched.
export default function SpotlightGroup({ children, className }: { children: ReactNode; className?: string }) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const card = (event.target as HTMLElement).closest<HTMLElement>('.spotlight');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
