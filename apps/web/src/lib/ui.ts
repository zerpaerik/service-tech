/** Clases compartidas de botones (Tailwind). */
export const buttonStyles = {
  primary:
    'inline-flex h-13.5 items-center justify-center gap-2.5 rounded-xl bg-brand px-6.5 text-base font-semibold text-on-brand shadow-[0_12px_32px_rgba(249,115,22,0.36)] transition hover:-translate-y-px hover:bg-brand-hover cursor-pointer',
  primarySm:
    'inline-flex h-10 items-center justify-center rounded-[10px] bg-brand px-3.5 text-sm font-semibold text-on-brand shadow-[0_8px_24px_rgba(249,115,22,0.32)] transition hover:-translate-y-px hover:bg-brand-hover cursor-pointer sm:h-11 sm:px-4.5',
  ghost:
    'inline-flex h-13.5 items-center justify-center gap-2.5 rounded-xl border border-line-3 bg-tint/5 px-5.5 text-base font-semibold text-fg transition hover:-translate-y-px hover:border-fg-faint/60 hover:bg-tint/10',
  ghostSm:
    'inline-flex h-11 items-center gap-2 self-start rounded-[10px] border border-line-3 bg-tint/6 px-4.5 text-sm font-semibold text-fg transition hover:-translate-y-px hover:border-fg-faint/60 hover:bg-tint/10 cursor-pointer',
  whatsapp:
    'inline-flex h-13.5 items-center justify-center gap-2.5 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-ink transition hover:-translate-y-px hover:brightness-105',
} as const;
