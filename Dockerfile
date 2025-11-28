# syntax=docker/dockerfile:1.7

# --- СТЕЙДЖ 1: "BUILDER" (Сборщик) ---
# Собирает ваше Next.js приложение
#-------------------------------------
FROM node:20-alpine AS builder

# Устанавливаем libc6-compat, который нужен некоторым нативным пакетам
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Настройка переменных окружения для Yarn 4 (Berry) и Node
ENV XDG_CACHE_HOME=/root/.cache
ENV YARN_ENABLE_GLOBAL_CACHE=1
ENV YARN_NM_MODE=hardlinks-local
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=2048

# Включаем corepack для управления версиями Yarn
RUN corepack enable

# --- ИСПРАВЛЕНИЕ ОШИБКИ 'ENOENT' ---
# Копируем *все* файлы, нужные для 'yarn install'.
# Ваша ошибка была в том, что вы не копировали папку '.yarn',
# в которой лежали бинарные файлы Yarn (yarn-4.7.0.cjs).
COPY package.json yarn.lock* .yarnrc.yml* .npmrc* ./
COPY .yarn ./.yarn
# -----------------------------------

# Устанавливаем зависимости, используя кэш Docker
RUN --mount=type=cache,id=yarn-cache,target=/root/.cache/yarn \
    corepack use yarn && yarn install --immutable --inline-builds

# --- ИСПРАВЛЕНИЕ ДЛЯ NEXT_PUBLIC_ ---
# Копируем .env.production, чтобы 'yarn build'
# мог "впечь" NEXT_PUBLIC_ переменные в код фронтенда.
COPY .env.production ./
# -----------------------------------

# Копируем *остальные* файлы проекта (src, public, next.config.js, и т.д.)
# (Убедитесь, что у вас есть .dockerignore, чтобы не копировать .git и node_modules)
COPY . .

# Передаем build-аргументы
ARG SITEMAP_BUILD_DISABLED=1
ENV SITEMAP_BUILD_DISABLED=$SITEMAP_BUILD_DISABLED

# Собираем приложение, используя кэш .next/cache
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    corepack use yarn && yarn build


# --- СТЕЙДЖ 2: "RUNNER" (Исполнитель) ---
# Запускает готовое 'standalone' приложение
#-----------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем не-root пользователя 'nextjs' для безопасности
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Копируем 'standalone' вывод из 'builder'
# (включает server.js и .next/server)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Копируем 'static' ассеты (js, css, и т.д.)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем 'public' ассеты (images, fonts, и т.д.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Указываем, что контейнер будет работать от имени 'nextjs'
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Команда для запуска Next.js сервера
CMD HOSTNAME="0.0.0.0" node server.js