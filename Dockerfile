# syntax=docker/dockerfile:1.7

# --- STAGE 1: BUILDER ---
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV XDG_CACHE_HOME=/root/.cache
ENV YARN_ENABLE_GLOBAL_CACHE=1
ENV YARN_NM_MODE=hardlinks-local
ENV NODE_OPTIONS=--max-old-space-size=2048

# Включаем corepack и используем Yarn
RUN corepack enable && corepack use yarn

# --- Установка зависимостей ---
COPY package.json yarn.lock* .yarnrc.yml* ./
COPY .yarn ./.yarn
RUN --mount=type=cache,id=yarn-cache,target=/root/.cache/yarn \
    yarn install --immutable --inline-builds

# --- Копируем исходники ---
COPY .env.production ./       
COPY src ./src
COPY public ./public

# --- Сборка ---
RUN --mount=type=cache,id=vite-cache,target=/app/node_modules/.vite \
    yarn build

# --- STAGE 2: RUNNER ---
FROM node:20-alpine AS runner
WORKDIR /app

# Устанавливаем serve для раздачи статики
RUN yarn global add serve

# Копируем готовую сборку
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000

CMD ["serve", "-s", "dist", "-l", "3000"]
