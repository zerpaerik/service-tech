import { CALL_TIME_ZONE, type Locale } from '@mandaito/shared';

/** Horas disponibles para llamadas (hora de Venezuela), de lunes a viernes. */
export const CALL_HOURS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

/** Cuántos días hábiles se ofrecen, empezando mañana. */
export const CALL_DAYS_AHEAD = 5;

export interface CallDay {
  /** AAAA-MM-DD */
  value: string;
  /** "Jue" / "Thu" */
  weekday: string;
  /** "27" */
  day: string;
  /** "jueves 27 nov" / "Thursday, Nov 27" */
  long: string;
}

/** Fecha de hoy en Venezuela (AAAA-MM-DD), sin importar la zona del visitante. */
function todayInCaracas(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: CALL_TIME_ZONE }).format(now);
}

/** Próximos días hábiles (lunes a viernes) a partir de mañana, en hora de Venezuela. */
export function upcomingCallDays(lang: Locale, now = new Date()): CallDay[] {
  const intl = lang === 'en' ? 'en-US' : 'es';
  const weekday = new Intl.DateTimeFormat(intl, { weekday: 'short', timeZone: 'UTC' });
  const long = new Intl.DateTimeFormat(intl, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
  const cursor = new Date(`${todayInCaracas(now)}T12:00:00Z`);
  const days: CallDay[] = [];
  while (days.length < CALL_DAYS_AHEAD) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const dow = cursor.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    days.push({
      value: cursor.toISOString().slice(0, 10),
      weekday: weekday.format(cursor).replace('.', ''),
      day: String(cursor.getUTCDate()),
      long: long
        .format(cursor)
        .replace(/\./g, '')
        .replace(/,(?= \d)/, ''),
    });
  }
  return days;
}

/** "09:00" → "9:00" para mostrar. */
export function displayHour(value: string): string {
  return value.replace(/^0/, '');
}
