/** Clases compartidas de botones (Tailwind). */
export const buttonStyles = {
  primary:
    'inline-flex h-13.5 items-center justify-center gap-2.5 rounded-xl bg-brand px-6.5 text-base font-semibold text-ink shadow-[0_12px_32px_rgba(249,115,22,0.36)] transition hover:-translate-y-px hover:bg-brand-soft cursor-pointer',
  primarySm:
    'inline-flex h-11 items-center justify-center rounded-[10px] bg-brand px-4.5 text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(249,115,22,0.32)] transition hover:-translate-y-px hover:bg-brand-soft cursor-pointer',
  ghost:
    'inline-flex h-13.5 items-center justify-center gap-2.5 rounded-xl border border-line-3 bg-white/5 px-5.5 text-base font-semibold text-fg transition hover:-translate-y-px hover:border-[#3a3f62] hover:bg-white/10',
  ghostSm:
    'inline-flex h-11 items-center gap-2 self-start rounded-[10px] border border-line-3 bg-white/6 px-4.5 text-sm font-semibold text-fg transition hover:-translate-y-px hover:border-[#3a3f62] hover:bg-white/10 cursor-pointer',
  whatsapp:
    'inline-flex h-13.5 items-center justify-center gap-2.5 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-ink transition hover:-translate-y-px hover:brightness-105',
} as const;
