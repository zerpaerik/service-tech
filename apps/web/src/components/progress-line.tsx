'use client';

import { motion, useReducedMotion } from 'motion/react';

/** Línea que se dibuja al llegar a la sección de proceso, con un punto por paso. */
export function ProgressLine({ steps }: { steps: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <div aria-hidden="true" className="relative mb-6 hidden lg:block">
      <div className="absolute top-1/2 right-7 left-7 h-px -translate-y-1/2 bg-line-2" />
      <motion.div
        className="absolute top-1/2 right-7 left-7 h-0.5 origin-left -translate-y-1/2 rounded-full bg-linear-to-r from-brand via-brand-soft to-accent"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="relative grid grid-cols-4 gap-5">
        {Array.from({ length: steps }, (_, index) => (
          <motion.span
            key={index}
            className="ml-7 block size-3.5 rounded-full border-2 border-brand-soft bg-ink-2 shadow-[0_0_0_4px_var(--ink-2)]"
            initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.4, delay: 0.25 + index * 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}
