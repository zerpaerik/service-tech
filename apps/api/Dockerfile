# API (NestJS + Prisma). Se construye desde la raíz del monorepo:
#   docker build -f apps/api/Dockerfile .
FROM node:24-alpine AS base
RUN apk add --no-cache openssl && npm install -g pnpm@11.1.3
ENV CI=true
WORKDIR /app

FROM base AS build
# 1) Solo manifiestos: aprovecha la caché de Docker para las dependencias.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter @mandaito/api...
# 2) Código y build.
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @mandaito/shared build && pnpm --filter @mandaito/api build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/api
USER node
EXPOSE 3001
# Las migraciones corren antes, en el "pre-deploy command" de Railway (pnpm run db:deploy).
CMD ["node", "dist/main.js"]
