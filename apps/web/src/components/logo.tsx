import { site } from '@/lib/site';

export function LogoMark({ id, size = 34 }: { id: string; size?: number }) {
  const gradientId = `logo-gradient-${id}`;
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill={`url(#${gradientId})`} />
      <path
        d="M13 11.5L8 17l5 5.5M21 11.5l5 5.5-5 5.5"
        stroke="#0A0B14"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ id, size }: { id: string; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark id={id} size={size} />
      <span className="font-display text-[19px] font-bold tracking-tight whitespace-nowrap">
        {site.shortName} <span className="text-brand-soft">Tech</span>
      </span>
    </span>
  );
}
