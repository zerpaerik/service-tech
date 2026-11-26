import { describe, expect, it } from 'vitest';
import { createLeadSchema, toFieldErrors } from './lead.js';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  leadReference,
  normalizeWhatsAppNumber,
} from './whatsapp.js';

describe('buildWhatsAppMessage', () => {
  it('incluye servicio, título, descripción y datos opcionales', () => {
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
        '*Título:* Tienda online',
        '*Descripción:* Catálogo con pagos',
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
    expect(message).not.toContain('Presupuesto');
    expect(message).not.toContain('Contacto');
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
  it('acepta una solicitud válida y limpia los espacios', () => {
    const result = createLeadSchema.parse({
      service: 'SOFTWARE',
      name: '  Juan ',
      contact: '',
      title: 'Sistema de inventario',
      description: 'Necesito controlar el stock de 3 tiendas.',
    });
    expect(result.name).toBe('Juan');
    expect(result.contact).toBeUndefined();
  });

  it('devuelve errores legibles por campo', () => {
    const result = createLeadSchema.safeParse({
      service: 'OTRO',
      name: 'J',
      title: '',
      description: 'corta',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = toFieldErrors(result.error);
      expect(errors.service).toBe('Elige un tipo de servicio');
      expect(errors.name).toBe('Escribe tu nombre');
      expect(errors.description).toContain('mínimo 10');
    }
  });
});

describe('createLeadSchema con campos ausentes', () => {
  it('responde en español cuando faltan campos obligatorios', () => {
    const result = createLeadSchema.safeParse({ service: 'WEB' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error)).toEqual({
        name: 'Escribe tu nombre',
        title: 'Escribe un título breve para tu proyecto',
        description: 'Cuéntanos un poco más (mínimo 10 caracteres)',
      });
    }
  });
});
