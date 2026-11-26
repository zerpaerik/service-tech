import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { loadEnv } from './config/env.js';

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  if (env.CORS_ORIGIN.length > 0) {
    app.enableCors({ origin: env.CORS_ORIGIN, methods: ['GET', 'POST'] });
  }
  app.enableShutdownHooks();

  // "::" escucha en IPv4 e IPv6: necesario para la red privada de Railway.
  await app.listen(env.PORT, '::');
}

await bootstrap();
