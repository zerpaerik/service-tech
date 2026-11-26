'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Aparición suave al hacer scroll. El HTML del servidor siempre es visible
 * (sin JS, para buscadores y conexiones lentas); al hidratar solo se ocultan
 * los bloques que aún no entraron en pantalla, para animarlos al llegar.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion) return;
    const alreadyVisible = element.getBoundingClientRect().top < window.innerHeight;
    if (!alreadyVisible) setAnimate(true);
  }, [reduceMotion]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={animate ? undefined : { opacity: 1, y: 0 }}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      style={animate ? { opacity: 0, y: 24 } : undefined}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
