/** Healthcheck del frontend para Railway. */
export function GET(): Response {
  return Response.json({ status: 'ok' });
}
