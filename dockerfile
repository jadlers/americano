FROM node:20-slim as build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN pnpm install

COPY . .
RUN pnpm exec prisma generate
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/build .

EXPOSE 3000
CMD ["node", "build"]
