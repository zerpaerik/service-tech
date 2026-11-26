import { z } from 'zod';

export const ENV = Symbol('ENV');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatorio'),
  PORT: z.coerce.number().int().positive().default(3001),
  /** Si se define, las rutas privadas exigen la cabecera x-api-key con este valor. */
  INTERNAL_API_KEY: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  /** Orígenes permitidos para CORS, separados por coma. Vacío = sin CORS (uso solo por red privada). */
  CORS_ORIGIN: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
});

export type Env = z.output<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
