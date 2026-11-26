import { ImageResponse } from 'next/og';
import { getDictionary, type Locale } from '@/i18n';
import { brandMarkDataUri } from './brand';

/** Imagen para compartir en redes (siempre en el diseño oscuro de la marca). */
export function renderOgImage(lang: Locale, size: { width: number; height: number }) {
  const t = getDictionary(lang).meta;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: '#0a0b14',
        color: '#edeef7',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -260,
          left: -160,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(249,115,22,0.45), transparent 65%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -300,
          right: -200,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(34,211,238,0.28), transparent 65%)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse no admite next/image */}
        <img src={brandMarkDataUri()} width={84} height={84} alt="" />
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 700 }}>
          Mandaito&nbsp;<span style={{ color: '#fb923c' }}>Tech</span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 48,
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          maxWidth: 980,
        }}
      >
        {t.ogHeadline}
      </div>
      <div style={{ display: 'flex', marginTop: 32, fontSize: 30, color: '#c3c6db' }}>
        {t.ogSubline}
      </div>
    </div>,
    size,
  );
}
