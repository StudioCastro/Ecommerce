FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# --omit=dev: eslint/vitest não entram na imagem de produção — menos superfície de ataque
# e menos peso. `prisma` (CLI) precisa continuar em "dependencies" no package.json porque
# roda em tempo de execução (migrate deploy no CMD abaixo), não só em build.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

# Usuário não-root: se o processo Node for comprometido (RCE numa dependência, por ex.),
# o atacante não herda privilégios de root dentro do container.
RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /app
USER app

EXPOSE 3333

# Permite que o orquestrador (docker-compose, k8s etc.) detecte e reinicie o container
# se o processo travar sem derrubar o processo Node.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3333/api-docs', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
