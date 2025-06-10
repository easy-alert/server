# --- Estágio 1: Builder ---
# Neste estágio, instalamos TODAS as dependências para poder buildar a aplicação.
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
# Aqui instalamos tudo, incluindo devDependencies, por isso não usamos --ignore-scripts
RUN npm install

COPY . .

# Gera o Prisma Client para o ambiente Linux.
RUN npx prisma generate

# Compila todo o seu código TypeScript para JavaScript.
RUN npm run build


# --- Estágio 2: Production ---
# Este é o contêiner final, enxuto e otimizado para produção.
FROM node:20-slim

WORKDIR /usr/src/app

# RESOLVE O PROBLEMA DO OPENSSL: Instala a biblioteca OpenSSL.
# RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copia os arquivos de dependência do estágio de build.
COPY --from=builder /usr/src/app/package*.json ./

# RESOLVE O PROBLEMA DO HUSKY: Instala as dependências de produção e ignora scripts como o "prepare".
RUN npm ci --omit=dev --ignore-scripts

# Copia a pasta 'dist' inteira, que contém seu app compilado e o seed.js.
COPY --from=builder /usr/src/app/dist ./dist

# Copia o schema do Prisma, necessário para as migrações em tempo de execução.
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

# Copie a CLI e o Cliente do Prisma para que o Job de migração funcione.
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/node_modules/prisma ./node_modules/prisma

# O comando padrão para INICIAR O SERVIÇO. Ele executará "node dist/src/server.js".
CMD ["npm", "start"]
