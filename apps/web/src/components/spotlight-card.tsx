'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';

/**
 * Tarjeta con un brillo suave que sigue al cursor. Mueve variables CSS
 * (sin re-renderizar React) y en pantallas táctiles simplemente no aparece.
 */
export function SpotlightCard({
  className = '',
  glow = 'brand',
  children,
}: {
  className?: string;
  glow?: 'brand' | 'accent';
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    ref.current.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <article ref={ref} onPointerMove={onPointerMove} className={`group relative ${className}`}>
      <div
        aria-hidden="true"
        className={`spotlight pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          glow === 'accent' ? '[--spot:var(--glow-accent)]' : ''
        }`}
      />
      {children}
    </article>
  );
}
