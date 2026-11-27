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

## Idiomas y tema

- **Español** en `/` e **inglés** en `/en`. Cada idioma tiene su layout raíz (`app/(es)` y `app/en`) con su `<html lang>`, metadatos, `hreflang` e imagen para redes. Los textos viven en `apps/web/src/i18n/es.ts` y `en.ts` (TypeScript avisa si falta una traducción).
- El mensaje de WhatsApp, los nombres de servicio y los errores del formulario salen en el idioma de la página (`packages/shared`). En la base de datos el presupuesto se guarda siempre en español.
- **Modo claro y oscuro**: por defecto sigue el tema del sistema; el botón del header lo cambia y lo recuerda (`localStorage`). Los colores son variables CSS en `globals.css`, y un script en `<head>` aplica el tema antes de pintar para evitar parpadeos.

## Promoción y campañas

**Enlaces directos** (para la bio de Instagram, anuncios o estados de WhatsApp). Abren el formulario al entrar:

| Enlace                             | Qué hace                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `https://tu-dominio/?solicitar`    | Abre "Solicitar servicio"                                                    |
| `https://tu-dominio/?servicio=web` | Lo abre con el servicio elegido (`web`, `software`, `marketing`, `sistemas`) |
| `https://tu-dominio/?agendar`      | Abre directo en "Agendar llamada"                                            |
| `https://tu-dominio/en?book`       | Lo mismo en inglés (`?request`, `?service=web`)                              |

Agrega parámetros UTM para saber qué campaña trae clientes, por ejemplo `?agendar&utm_source=instagram&utm_medium=bio&utm_campaign=lanzamiento`. El origen se guarda con cada solicitud (columna `source` de la tabla `leads`).

**Textos que se editan a mano** (en `apps/web/src/i18n/es.ts` y `en.ts`):

- `promo`: la franja superior de promoción. En `null` no se muestra.
- `packages.plans`: paquetes, precios (`price: null` muestra "A medida") y lo que incluye cada uno.
- `faq.items`: preguntas frecuentes.

**Horario de llamadas**: `apps/web/src/lib/schedule.ts` (`CALL_HOURS`, de lunes a viernes, hora de Venezuela).

**Medición**: con `GA_MEASUREMENT_ID` y/o `META_PIXEL_ID` en el servicio web se activan Google Analytics 4 y el Pixel de Meta, con estos eventos:

- al abrir el formulario: `open_form`;
- al enviar una solicitud: `generate_lead` en GA4, y `Lead` o `Schedule` en Meta;
- al tocar WhatsApp: `contact_whatsapp` en GA4 y `Contact` en Meta;
- al tocar el correo: `contact_email` en GA4 y `Contact` en Meta;
- al tocar Instagram: `visit_instagram` en GA4 y `VisitInstagram` en Meta.

Los clics de contacto llevan `place`: la sección (`inicio`, `contacto`…), `footer`, `mobile-bar` o `floating`.

**Contacto del pie**: correo e Instagram en `apps/web/src/lib/site.ts`.

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

| Servicio | Variable            | Descripción                                                                   |
| -------- | ------------------- | ----------------------------------------------------------------------------- |
| api      | `DATABASE_URL`      | Conexión a Postgres                                                           |
| api      | `PORT`              | Puerto (3001 por defecto)                                                     |
| api      | `INTERNAL_API_KEY`  | Opcional: exige la cabecera `x-api-key`                                       |
| api      | `CORS_ORIGIN`       | Opcional: orígenes permitidos, separados por coma (solo si el API es público) |
| web      | `WHATSAPP_NUMBER`   | Número de destino. **Se fija en el build**                                    |
| web      | `SITE_URL`          | URL pública (canonical, sitemap, Open Graph). **Se fija en el build**         |
| web      | `GA_MEASUREMENT_ID` | Opcional. Google Analytics 4 (`G-…`). **Se fija en el build**                 |
| web      | `META_PIXEL_ID`     | Opcional. Pixel de Meta (solo dígitos). **Se fija en el build**               |
| web      | `API_INTERNAL_URL`  | URL del API                                                                   |
| web      | `INTERNAL_API_KEY`  | Debe coincidir con la del API si se usa                                       |

La página se genera estática para que cargue más rápido, así que `WHATSAPP_NUMBER` y `SITE_URL` se leen al compilar. En Railway, cambiar una variable dispara un nuevo deploy, que vuelve a compilar.

## Deploy

Ver [DEPLOY.md](DEPLOY.md).
