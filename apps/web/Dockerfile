# Web (Next.js, salida standalone). Se construye desde la raíz del monorepo:
#   docker build -f apps/web/Dockerfile --build-arg WHATSAPP_NUMBER=... --build-arg SITE_URL=... .
FROM node:24-alpine AS base
RUN npm install -g pnpm@11.1.3
ENV CI=true NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @mandaito/web...
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/web apps/web
# La página es estática: estos valores se fijan en el build.
# Railway pasa las variables del servicio como build args al declararlas aquí.
ARG WHATSAPP_NUMBER=""
ARG SITE_URL=""
ENV WHATSAPP_NUMBER=$WHATSAPP_NUMBER SITE_URL=$SITE_URL
RUN pnpm --filter @mandaito/shared build && pnpm --filter @mandaito/web build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=node:node /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
