# --- Estágio 1: Builder ---
FROM node:20-slim AS builder
WORKDIR /usr/src/app

# Instala o OpenSSL para garantir que o ambiente de build e prod sejam idênticos.
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

# Gera o Query Engine do Prisma para o ambiente correto (debian-openssl-3.0.x).
RUN npx prisma generate
# Compila seu código TypeScript para JavaScript.
RUN npm run build


# --- Estágio 2: Production ---
FROM node:20-slim
WORKDIR /usr/src/app

# Instala o OpenSSL.
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copia os arquivos de dependência.
COPY --from=builder /usr/src/app/package*.json ./

# Copia a pasta node_modules inteira para incluir addons nativos (bcrypt, etc.).
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia a pasta 'dist' inteira com seu app compilado.
COPY --from=builder /usr/src/app/dist ./dist

# Copia a pasta PRISMA inteira, incluindo o schema E a pasta de migrações.
COPY --from=builder /usr/src/app/prisma ./prisma

# O comando padrão para INICIAR O SERVIÇO.
CMD ["npm", "start"]
