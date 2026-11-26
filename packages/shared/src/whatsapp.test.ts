import { describe, expect, it } from 'vitest';
import { buildLeadSchema, callDateTime, createLeadSchema, toFieldErrors } from './lead.js';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatCallDay,
  leadReference,
  normalizeWhatsAppNumber,
} from './whatsapp.js';

describe('buildWhatsAppMessage: solicitud de servicio', () => {
  it('incluye servicio, lo que necesita y datos opcionales', () => {
    const message = buildWhatsAppMessage({
      service: 'WEB',
      name: 'María',
      title: 'Tienda online',
      description: 'Catálogo con pagos',
      budget: '$50 – $200',
      contact: 'maria@correo.com',
      reference: '#ABC123',
    });
    expect(message).toBe(
      [
        'Hola, soy María.',
        'Quiero solicitar: *Desarrollo web*',
        '',
        '*Necesito:* Tienda online',
        '*Detalles:* Catálogo con pagos',
        '*Presupuesto:* $50 – $200',
        '*Contacto:* maria@correo.com',
        '',
        'Ref. #ABC123',
      ].join('\n'),
    );
  });

  it('usa marcadores cuando faltan datos y omite los opcionales', () => {
    const message = buildWhatsAppMessage({ service: 'MARKETING' });
    expect(message).toContain('Hola, soy [tu nombre].');
    expect(message).toContain('*Marketing digital*');
    expect(message).toContain('*Necesito:* [lo que necesitas]');
    expect(message).not.toContain('Presupuesto');
    expect(message).not.toContain('Contacto');
  });

  it('sin idea elegida muestra solo los detalles', () => {
    const message = buildWhatsAppMessage({ service: 'WEB', name: 'Ana', description: 'Una web' });
    expect(message).not.toContain('Necesito');
    expect(message).toContain('*Detalles:* Una web');
  });

  it('traduce etiquetas, servicio y presupuesto al inglés', () => {
    const message = buildWhatsAppMessage(
      { service: 'SOFTWARE', name: 'John', title: 'Inventory', budget: 'Más de $1.000' },
      'en',
    );
    expect(message).toBe(
      [
        "Hi, I'm John.",
        "I'd like to request: *Custom software*",
        '',
        '*I need:* Inventory',
        '*Budget:* Over $1,000',
      ].join('\n'),
    );
  });
});

describe('buildWhatsAppMessage: llamada', () => {
  it('arma la cita con día, hora y medio', () => {
    const message = buildWhatsAppMessage({
      kind: 'CALL',
      service: 'WEB',
      name: 'María',
      callMode: 'VIDEO',
      callDate: '2026-11-26',
      callTime: '10:00',
      reference: '#ABC123',
    });
    expect(message).toBe(
      [
        'Hola, soy María.',
        'Quiero agendar una *videollamada* para hablar de *Desarrollo web*.',
        '',
        '*Día:* jueves 26/11',
        '*Hora:* 10:00 (hora de Venezuela)',
        '',
        'Ref. #ABC123',
      ].join('\n'),
    );
  });

  it('en inglés', () => {
    const message = buildWhatsAppMessage(
      {
        kind: 'CALL',
        service: 'SYSTEMS',
        name: 'John',
        callMode: 'WHATSAPP',
        callDate: '2026-11-26',
        callTime: '15:00',
      },
      'en',
    );
    expect(message).toContain(
      "I'd like to schedule a *WhatsApp call* to talk about *Systems & apps*.",
    );
    expect(message).toContain('*Day:* Thursday, Nov 26');
    expect(message).toContain('*Time:* 15:00 (Venezuela time, GMT−4)');
  });

  it('formatea el día de la llamada', () => {
    expect(formatCallDay('2026-12-01', 'es')).toBe('martes 1/12');
    expect(formatCallDay('2026-12-01', 'en')).toBe('Tuesday, Dec 1');
  });

  it('convierte la cita a un instante en hora de Venezuela', () => {
    expect(callDateTime('2026-11-26', '10:00').toISOString()).toBe('2026-11-26T14:00:00.000Z');
  });
});

describe('buildWhatsAppUrl', () => {
  it('normaliza el número y codifica el mensaje', () => {
    expect(buildWhatsAppUrl('+58 412-123.4567', 'Hola & chao')).toBe(
      'https://wa.me/584121234567?text=Hola%20%26%20chao',
    );
  });

  it('funciona sin número configurado', () => {
    expect(buildWhatsAppUrl(undefined)).toBe('https://wa.me/');
    expect(normalizeWhatsAppNumber('')).toBe('');
  });
});

describe('leadReference', () => {
  it('toma los últimos 6 caracteres en mayúsculas', () => {
    expect(leadReference('cmabc12xyz789')).toBe('#XYZ789');
  });
});

describe('createLeadSchema', () => {
  it('acepta una solicitud mínima: servicio, nombre y una idea', () => {
    const result = createLeadSchema.parse({
      service: 'SOFTWARE',
      name: '  Juan ',
      contact: '',
      title: 'Sistema de inventario',
      description: '',
    });
    expect(result).toMatchObject({ kind: 'REQUEST', name: 'Juan', locale: 'es' });
    expect(result.contact).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it('acepta solo la descripción, sin idea elegida', () => {
    expect(
      createLeadSchema.safeParse({ service: 'WEB', name: 'Ana', description: 'Una web' }).success,
    ).toBe(true);
  });

  it('pide una idea o descripción cuando no hay ninguna', () => {
    const result = createLeadSchema.safeParse({ service: 'WEB', name: 'Ana' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error)).toEqual({
        title: 'Elige una idea o cuéntanos qué necesitas',
      });
    }
  });

  it('devuelve errores legibles por campo', () => {
    const result = createLeadSchema.safeParse({ service: 'OTRO', name: 'J' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = toFieldErrors(result.error);
      expect(errors.service).toBe('Elige un tipo de servicio');
      expect(errors.name).toBe('Escribe tu nombre');
    }
  });

  it('una llamada exige medio, día y hora válidos', () => {
    const missing = createLeadSchema.safeParse({ kind: 'CALL', service: 'WEB', name: 'Ana' });
    expect(missing.success).toBe(false);
    if (!missing.success) {
      expect(toFieldErrors(missing.error)).toEqual({
        callMode: 'Elige cómo prefieres hablar',
        callDate: 'Elige un día',
        callTime: 'Elige una hora',
      });
    }
    const invalid = createLeadSchema.safeParse({
      kind: 'CALL',
      service: 'WEB',
      name: 'Ana',
      callMode: 'VIDEO',
      callDate: '2026-02-31',
      callTime: '25:00',
    });
    expect(invalid.success).toBe(false);

    const ok = createLeadSchema.parse({
      kind: 'CALL',
      service: 'WEB',
      name: 'Ana',
      callMode: 'PHONE',
      callDate: '2026-11-27',
      callTime: '09:00',
      locale: 'en',
    });
    expect(ok).toMatchObject({ kind: 'CALL', callMode: 'PHONE', locale: 'en' });
  });
});

describe('buildLeadSchema en inglés', () => {
  it('devuelve los errores en inglés', () => {
    const result = buildLeadSchema('en').safeParse({ service: 'WEB', name: 'J' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error)).toEqual({
        name: 'Enter your name',
        title: 'Pick an idea or tell us what you need',
      });
    }
  });
});
