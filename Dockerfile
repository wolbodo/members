FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY build /usr/src/app
