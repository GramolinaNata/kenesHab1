# syntax=docker/dockerfile:1.7

# --- СТЕЙДЖ 1: "BUILDER" (Сборщик) ---
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV XDG_CACHE_HOME=/root/.cache
ENV YARN_ENABLE_GLOBAL_CACHE=1
ENV YARN_NM_MODE=hardlinks-local
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=2048

# Включаем corepack и сразу выбираем версию
RUN corepack enable && corepack use yarn

# --- Слой 1: Установка зависимостей ---
# Копируем только то, что нужно для 'yarn install'
# Этот слой будет кэшироваться, пока yarn.lock не изменится
COPY package.json yarn.lock* .yarnrc.yml* .npmrc* ./


RUN --mount=type=cache,id=yarn-cache,target=/root/.cache/yarn \
    yarn install --immutable --inline-builds

# --- Слой 2: Конфигурация сборки ---
# Копируем .env и файлы конфигурации.
# Этот слой кэшируется, даже если вы меняете код в /src
COPY .env.production ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./



# --- Слой 3: Исходный код ---
# Копируем только те папки, которые нужны для 'yarn build'
# (Все ваши 'README.md', 'docs/', '.idea/' и т.д. теперь ИГНОРИРУЮТСЯ)
COPY src ./src
COPY public ./public
COPY index.html ./

# Передаем build-аргументы
ARG SITEMAP_BUILD_DISABLED=1
ENV SITEMAP_BUILD_DISABLED=$SITEMAP_BUILD_DISABLED

# --- Слой 4: Сборка ---
# Этот шаг запустится, только если изменились слои 1, 2 или 3.
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    yarn build


# --- СТЕЙДЖ 2: "RUNNER" (Без изменений) ---
# Эта часть у вас была идеальной.
#-----------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001


COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 13333
ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js