/**
 * Recuerda de dónde llegó la persona (parámetros UTM o sitio de referencia)
 * durante la visita, para guardarlo con su solicitud y saber qué promoción funciona.
 */
const STORAGE_KEY = 'mandaito-source';

function describeSource(): string {
  const params = new URLSearchParams(window.location.search);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign']
    .map((key) => params.get(key)?.trim())
    .filter(Boolean);
  if (utm.length > 0) return utm.join(' / ');
  try {
    const referrer = document.referrer ? new URL(document.referrer).hostname : '';
    if (referrer && referrer !== window.location.hostname) return `ref: ${referrer}`;
  } catch {
    // Referencia inválida: la tratamos como visita directa.
  }
  return 'directo';
}

/** Guarda el origen la primera vez que la persona entra en esta visita. */
export function captureSource(): void {
  try {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, describeSource().slice(0, 200));
    }
  } catch {
    // Sin almacenamiento (modo privado): se calcula al enviar.
  }
}

export function getSource(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? describeSource().slice(0, 200);
  } catch {
    return describeSource().slice(0, 200);
  }
}
