/** Logo de Mandaito Tech: burbuja de chat en degradado con una M que crece (concepto AB2). */
export const brandMark = {
  viewBox: '0 0 64 64',
  bubble:
    'M18 6h28a14 14 0 0 1 14 14v16a14 14 0 0 1-14 14H30l-13 9.5V49.4A14 14 0 0 1 4 36V20A14 14 0 0 1 18 6z',
  growth: 'M19 39V19l11 11 15-15M35 15h10v10',
  ink: '#0A0B14',
  gradient: [
    { offset: 0, color: '#F97316' },
    { offset: 0.5, color: '#FB923C' },
    { offset: 1, color: '#22D3EE' },
  ],
} as const;

/** El logo como SVG completo (para data URIs en imágenes generadas). */
export function brandMarkSvg(): string {
  const stops = brandMark.gradient
    .map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${brandMark.viewBox}">` +
    `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="4" y1="58" x2="60" y2="6">${stops}</linearGradient></defs>` +
    `<path d="${brandMark.bubble}" fill="url(#g)"/>` +
    `<path d="${brandMark.growth}" stroke="${brandMark.ink}" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `</svg>`
  );
}

export function brandMarkDataUri(): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(brandMarkSvg())}`;
}
