import { ImageResponse } from 'next/og';
import { brandMarkDataUri } from '@/lib/brand';
import { site } from '@/lib/site';

export const alt = `${site.name} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
        Convertimos ideas en software que hace crecer tu negocio
      </div>
      <div style={{ display: 'flex', marginTop: 32, fontSize: 30, color: '#c3c6db' }}>
        Software a medida · Webs desde $50 · Marketing digital
      </div>
    </div>,
    size,
  );
}
