FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

WORKDIR /usr/src/app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS build

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN pnpm build
RUN pnpm prune --prod --ignore-scripts

FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/package.json ./package.json

USER node

EXPOSE 3333

CMD ["node", "dist/infra/http/server.js"]
