# Mandaito Tech

Landing para promocionar servicios de software a medida, desarrollo web, marketing digital y sistemas. El visitante elige un servicio, describe su proyecto y continúa la conversación por **WhatsApp** con el mensaje ya armado. Cada solicitud queda registrada en PostgreSQL.

## Stack

| Capa          | Tecnología                                                       |
| ------------- | ---------------------------------------------------------------- |
| Frontend      | Next.js 16 (App Router, Cache Components), React 19, Tailwind v4 |
| Backend       | NestJS 12, Prisma 7 (adaptador `pg`), Zod                        |
| Base de datos | PostgreSQL 17                                                    |
| Monorepo      | pnpm workspaces + Turborepo                                      |
| Calidad       | TypeScript estricto, Vitest, oxlint, Prettier                    |
| Deploy        | Railway (Dockerfile por servicio)                                |

## Estructura

```
apps/
  web/       Next.js: landing, modal de solicitud y Server Action
  api/       NestJS: POST /leads, GET /health, Prisma y migraciones
packages/
  shared/    Catálogo de servicios, validación (Zod) y armado del mensaje de WhatsApp
```

`packages/shared` es la fuente única de verdad: el formulario, la Server Action y el API validan con el mismo esquema.

## Flujo de una solicitud

1. El visitante abre el modal ("Solicitar servicio" o el botón de una tarjeta) y completa servicio, nombre, título, descripción, presupuesto y contacto opcional. Mientras escribe, ve la vista previa del mensaje.
2. La **Server Action** (`apps/web/src/app/actions.ts`) valida los datos y llama a `POST /leads` del API por la red privada, reenviando la IP del visitante.
3. El API guarda el lead y devuelve su `id`. Con él se arma el mensaje, que incluye una referencia corta (`Ref. #ABC123`) para ubicar el lead en la base.
4. Se abre `wa.me/<número>?text=...`. **Si el API no responde, WhatsApp se abre igual**, así nunca se pierde un contacto.

Protecciones: campo trampa contra bots, límite de 5 solicitudes por minuto por IP, validación en el cliente y en el servidor, `helmet` y cabeceras de seguridad. Opcionalmente, una API key compartida entre web y API (`INTERNAL_API_KEY`).

## Desarrollo local

Requisitos: Node 24 (`.nvmrc`), pnpm 11 y Docker.

```bash
pnpm install
pnpm db:up                                   # Postgres en Docker (puerto 5433)
cp .env.example apps/api/.env                # deja solo el bloque del API
cp .env.example apps/web/.env.local          # deja solo el bloque de la web
pnpm db:migrate                              # aplica las migraciones
pnpm dev                                     # web en :3000, API en :3001
```

En `apps/web/.env.local` define `WHATSAPP_NUMBER` con código de país y solo dígitos (por ejemplo `584121234567`).

### Scripts (desde la raíz)

| Script                        | Qué hace                                         |
| ----------------------------- | ------------------------------------------------ |
| `pnpm dev`                    | Levanta shared (watch), API y web                |
| `pnpm build`                  | Compila todo con Turborepo                       |
| `pnpm test`                   | Tests de shared y e2e del API                    |
| `pnpm typecheck`              | Verificación de tipos                            |
| `pnpm lint` / `pnpm format`   | oxlint / Prettier                                |
| `pnpm db:up` / `pnpm db:down` | Inicia / detiene Postgres local                  |
| `pnpm db:migrate`             | Crea y aplica migraciones (`prisma migrate dev`) |
| `pnpm db:studio`              | Abre Prisma Studio para ver los leads            |

## Variables de entorno

| Servicio | Variable           | Descripción                                                                   |
| -------- | ------------------ | ----------------------------------------------------------------------------- |
| api      | `DATABASE_URL`     | Conexión a Postgres                                                           |
| api      | `PORT`             | Puerto (3001 por defecto)                                                     |
| api      | `INTERNAL_API_KEY` | Opcional: exige la cabecera `x-api-key`                                       |
| api      | `CORS_ORIGIN`      | Opcional: orígenes permitidos, separados por coma (solo si el API es público) |
| web      | `WHATSAPP_NUMBER`  | Número de destino. **Se fija en el build**                                    |
| web      | `SITE_URL`         | URL pública (canonical, sitemap, Open Graph). **Se fija en el build**         |
| web      | `API_INTERNAL_URL` | URL del API                                                                   |
| web      | `INTERNAL_API_KEY` | Debe coincidir con la del API si se usa                                       |

La página se genera estática para que cargue más rápido, así que `WHATSAPP_NUMBER` y `SITE_URL` se leen al compilar. En Railway, cambiar una variable dispara un nuevo deploy, que vuelve a compilar.

## Deploy

Ver [DEPLOY.md](DEPLOY.md).
