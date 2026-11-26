import { brandMark } from '@/lib/brand';
import { site } from '@/lib/site';

/** Símbolo de la marca. `id` debe ser único en la página (define el degradado). */
export function LogoMark({ id, size = 34 }: { id: string; size?: number }) {
  const gradientId = `mandaito-mark-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox={brandMark.viewBox}
      aria-hidden="true"
      className="flex-none"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="4"
          y1="58"
          x2="60"
          y2="6"
        >
          {brandMark.gradient.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      <path d={brandMark.bubble} fill={`url(#${gradientId})`} />
      <path
        d={brandMark.growth}
        stroke={brandMark.ink}
        strokeWidth={5.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  id,
  size,
  wordmarkClassName = '',
}: {
  id: string;
  size?: number;
  wordmarkClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5">
      <LogoMark id={id} size={size} />
      <span
        className={`font-display text-[17px] font-bold tracking-tight whitespace-nowrap sm:text-[19px] ${wordmarkClassName}`}
      >
        {site.shortName} <span className="text-brand-soft">Tech</span>
      </span>
    </span>
  );
}
