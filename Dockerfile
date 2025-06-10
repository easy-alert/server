# --- Estágio 1: Builder ---
# Neste estágio, instalamos TODAS as dependências para poder buildar a aplicação.
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# ESSENCIAL: Gera o Prisma Client para o ambiente Linux.
RUN npx prisma generate

# ESSENCIAL: Compila todo o seu código TypeScript para JavaScript.
# Isso irá criar a pasta 'dist' com base no seu tsconfig.json.
RUN npm run build

# --- Estágio 2: Production ---
# Este é o contêiner final, enxuto e otimizado para produção.
FROM node:20-slim

WORKDIR /usr/src/app

# Copia os arquivos de dependência do estágio de build.
COPY --from=builder /usr/src/app/package*.json ./

# Instala SOMENTE as dependências de produção.
RUN npm ci --omit=dev

# Copia a pasta 'dist' inteira, que contém seu app compilado e o seed.js.
COPY --from=builder /usr/src/app/dist ./dist

# Copia o schema do Prisma, necessário para as migrações em tempo de execução.
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

# IMPORTANTE: Copie a CLI e o Cliente do Prisma para que o Job de migração funcione.
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma

# O comando padrão para INICIAR O SERVIÇO. Ele executará "node dist/src/server.js".
CMD ["npm", "start"]
