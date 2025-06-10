# --- Estágio 1: Builder ---
# Neste estágio, instalamos TODAS as dependências para poder buildar a aplicação.
FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build


# --- Estágio 2: Production ---
# Este é o contêiner final, enxuto e otimizado para produção.
FROM node:20-slim

WORKDIR /usr/src/app

# Instala a biblioteca OpenSSL para o Prisma se conectar de forma segura.
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copia os arquivos de dependência do estágio de build.
COPY --from=builder /usr/src/app/package*.json ./

# Em vez de reinstalar, copie a pasta node_modules inteira do estágio builder.
# Isso garante que todos os addons nativos compilados (como o bcrypt)
# sejam trazidos para a imagem final.
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia a pasta 'dist' inteira, que contém seu app compilado.
COPY --from=builder /usr/src/app/dist ./dist

# Copia o schema do Prisma, necessário para as migrações em tempo de execução.
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

# O comando padrão para INICIAR O SERVIÇO.
CMD ["npm", "start"]
