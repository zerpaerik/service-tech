import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { ENV, loadEnv } from '../src/config/env.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const validLead = {
  service: 'WEB',
  name: 'María',
  title: 'Tienda online',
  description: 'Necesito un catálogo con pagos en línea.',
  budget: '$50 – $200',
};

function createPrismaMock() {
  return {
    lead: { create: vi.fn().mockResolvedValue({ id: 'cmtest0000abc123' }) },
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  };
}

async function createApp(apiKey?: string) {
  const prisma = createPrismaMock();
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ENV)
    .useValue(loadEnv({ DATABASE_URL: 'postgresql://test', INTERNAL_API_KEY: apiKey }))
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  return { app, prisma };
}

describe('API de leads', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    ({ app, prisma } = await createApp());
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health responde ok cuando la base de datos está disponible', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' });
  });

  it('GET /health responde 503 si la base de datos falla', async () => {
    prisma.$queryRaw.mockRejectedValueOnce(new Error('down'));
    await request(app.getHttpServer()).get('/health').expect(503);
  });

  it('POST /leads guarda una solicitud válida y devuelve su id', async () => {
    const res = await request(app.getHttpServer()).post('/leads').send(validLead).expect(201);
    expect(res.body).toEqual({ id: 'cmtest0000abc123' });
    expect(prisma.lead.create).toHaveBeenCalledWith({
      data: {
        kind: 'REQUEST',
        service: 'WEB',
        name: 'María',
        contact: null,
        title: 'Tienda online',
        description: 'Necesito un catálogo con pagos en línea.',
        budget: '$50 – $200',
        callAt: null,
        callMode: null,
        source: null,
        locale: 'es',
      },
      select: { id: true },
    });
  });

  it('POST /leads guarda una llamada con la cita en hora de Venezuela', async () => {
    await request(app.getHttpServer())
      .post('/leads')
      .send({
        kind: 'CALL',
        service: 'SYSTEMS',
        name: 'John',
        callMode: 'VIDEO',
        callDate: '2026-11-27',
        callTime: '10:00',
        source: 'instagram / cpc / lanzamiento',
        locale: 'en',
      })
      .expect(201);
    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          kind: 'CALL',
          title: null,
          description: null,
          callAt: new Date('2026-11-27T14:00:00.000Z'),
          callMode: 'VIDEO',
          source: 'instagram / cpc / lanzamiento',
          locale: 'en',
        }),
      }),
    );
  });

  it('POST /leads rechaza datos inválidos con errores por campo', async () => {
    const res = await request(app.getHttpServer())
      .post('/leads')
      .send({ service: 'OTRO', name: 'M', title: '' })
      .expect(400);
    expect(res.body.errors).toMatchObject({
      service: 'Elige un tipo de servicio',
      name: 'Escribe tu nombre',
    });
    expect(prisma.lead.create).not.toHaveBeenCalled();
  });

  it('POST /leads limita a 5 solicitudes por minuto por visitante', async () => {
    const server = app.getHttpServer();
    for (let i = 0; i < 5; i++) {
      await request(server)
        .post('/leads')
        .set('x-forwarded-for', '1.1.1.1')
        .send(validLead)
        .expect(201);
    }
    await request(server)
      .post('/leads')
      .set('x-forwarded-for', '1.1.1.1')
      .send(validLead)
      .expect(429);
    // Otro visitante no se ve afectado.
    await request(server)
      .post('/leads')
      .set('x-forwarded-for', '2.2.2.2')
      .send(validLead)
      .expect(201);
  });
});

describe('API de leads con INTERNAL_API_KEY', () => {
  it('exige la cabecera x-api-key correcta', async () => {
    const { app } = await createApp('secreto');
    const server = app.getHttpServer();
    await request(server).post('/leads').send(validLead).expect(401);
    await request(server).post('/leads').set('x-api-key', 'otro').send(validLead).expect(401);
    await request(server).post('/leads').set('x-api-key', 'secreto').send(validLead).expect(201);
    // El healthcheck sigue abierto para Railway.
    await request(server).get('/health').expect(200);
    await app.close();
  });
});
