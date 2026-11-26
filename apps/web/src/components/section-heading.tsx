import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto mb-14 max-w-[720px] text-center">
      <p className="text-[13px] font-semibold tracking-[0.14em] text-brand-soft uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3.5 font-display text-[clamp(32px,4vw,48px)] leading-[1.12] font-bold tracking-tight">
        {title}
      </h2>
      {children ? <p className="mt-4 text-lg leading-relaxed text-fg-muted">{children}</p> : null}
    </div>
  );
}
