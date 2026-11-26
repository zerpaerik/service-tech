# Deploy en Railway

El proyecto se despliega como **un proyecto de Railway con 3 servicios**:

```
            Internet
               │ (dominio público)
          ┌────▼────┐   red privada    ┌─────────┐        ┌──────────┐
          │   web   │ ───────────────► │   api   │ ─────► │ Postgres │
          │ Next.js │  api.railway.    │ NestJS  │        │          │
          └─────────┘  internal:3001   └─────────┘        └──────────┘
```

Solo `web` tiene dominio público. El API se alcanza únicamente por la red privada, así que no necesita CORS y queda menos expuesto.

Cada app trae su `Dockerfile` y su `railway.json` (config as code): builder, _watch paths_, healthcheck y migraciones. Las imágenes se construyen desde la **raíz del repo**, porque necesitan `packages/shared`.

## Opción rápida: solo la web (sin API ni base de datos)

La web funciona sola: el formulario abre WhatsApp con el mensaje armado, pero **las solicitudes no se guardan**.

1. **New Project → Deploy from GitHub repo** y elige este repositorio (un solo servicio).
2. No hace falta tocar _Settings_: el `railway.json` de la raíz del repo ya le indica a Railway que construya la web con `apps/web/Dockerfile`. Deja _Root Directory_ vacío.
3. **Variables**:
   ```
   WHATSAPP_NUMBER=584243298448
   SITE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
   ```
   No definas `API_INTERNAL_URL`: sin ella, la web no intenta guardar nada.
4. **Networking → Generate Domain**.

Para sumar el API más adelante, sigue los pasos 1 a 3 de abajo (Postgres y `api`) y agrega `API_INTERNAL_URL` al servicio `web`.

## 1. Crear el proyecto

1. En Railway: **New Project → Deploy from GitHub repo** y elige este repositorio.
   Railway crea un servicio; ese será `web` (puedes renombrarlo).
2. **+ New → Database → PostgreSQL**. Queda un servicio llamado `Postgres`.
3. **+ New → GitHub Repo**, el mismo repositorio otra vez. Este será `api`.

> Usa exactamente los nombres `api` y `Postgres`: las referencias de variables de abajo dependen de ellos.

## 2. Configurar el servicio `api`

**Settings**

- **Root Directory**: vacío (la raíz del repo).
- **Config-as-code → Railway Config File**: `/apps/api/railway.json`. **Obligatorio**: sin esto, el servicio usaría el `railway.json` de la raíz y construiría la web.
- **Networking**: no generes dominio público.

**Variables**

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3001
INTERNAL_API_KEY=<una cadena aleatoria larga>   # opcional, recomendado
```

`railway.json` ya define:

- `preDeployCommand: pnpm run db:deploy`, que aplica las migraciones de Prisma antes de cada versión.
- Un healthcheck en `/health`, que también verifica la conexión a Postgres.

## 3. Configurar el servicio `web`

**Settings**

- **Root Directory**: vacío.
- **Config-as-code → Railway Config File**: `/apps/web/railway.json` (opcional: el `railway.json` de la raíz ya apunta a la web).
- **Networking → Generate Domain** (o agrega tu dominio propio).

**Variables**

```
WHATSAPP_NUMBER=584243298448              # código de país + número, solo dígitos
SITE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}   # o tu dominio propio, ej. https://mandaito.tech
API_INTERNAL_URL=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}
INTERNAL_API_KEY=${{api.INTERNAL_API_KEY}}  # solo si lo definiste en el api
GA_MEASUREMENT_ID=G-XXXXXXXXXX             # opcional: Google Analytics 4
META_PIXEL_ID=123456789012345              # opcional: Pixel de Meta (Facebook/Instagram Ads)
```

`WHATSAPP_NUMBER`, `SITE_URL` y los IDs de medición se pasan al build (el Dockerfile los declara como `ARG`), porque la página es estática. Cambiarlos redespliega y recompila automáticamente.

Healthcheck: `/api/health`.

## 4. Desplegar y verificar

1. Despliega `api` primero (migra la base) y después `web`.
2. Abre el dominio de `web`, envía una solicitud de prueba y confirma que se abre WhatsApp con el mensaje.
3. Revisa que el lead quedó guardado: en Railway, servicio **Postgres → Data → tabla `leads`**. También puedes conectarte localmente con `pnpm db:studio` usando la URL pública de Postgres.

## Notas

- **Watch paths**: un cambio en `apps/web` no redespliega el API, y viceversa. Los cambios en `packages/shared` o `pnpm-lock.yaml` redespliegan ambos.
- **Nuevas migraciones**: créalas en local con `pnpm db:migrate`, haz commit de `apps/api/prisma/migrations` y el pre-deploy las aplica en Railway.
- **Probar las imágenes en local**:
  ```bash
  docker build -f apps/api/Dockerfile -t mandaito-api .
  docker build -f apps/web/Dockerfile --build-arg WHATSAPP_NUMBER=584243298448 -t mandaito-web .
  ```
- **Varias réplicas de `web`**: define `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (la misma en todas) para que las Server Actions funcionen entre instancias.
