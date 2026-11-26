import { ImageResponse } from 'next/og';
import { brandMarkDataUri } from '@/lib/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Ícono para la pantalla de inicio de iOS (fondo sólido, sin transparencia). */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0b14',
      }}
    >
      {/* oxlint-disable-next-line nextjs/no-img-element -- ImageResponse no admite next/image */}
      <img src={brandMarkDataUri()} width={124} height={124} alt="" />
    </div>,
    size,
  );
}
