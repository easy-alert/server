# --- Estágio 1: Builder ---
# Neste estágio, preparamos tudo para a construção.
FROM node:20-slim AS builder

WORKDIR /usr/src/app

### MUDANÇA CRÍTICA ###
# 1. Instale o OpenSSL AQUI, no builder, para que o prisma generate
# detecte o mesmo ambiente que a imagem de produção terá.
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*
### FIM DA MUDANÇA CRÍTICA ###

# Continue com a instalação normal
COPY package*.json ./
RUN npm install

# Copie o resto do código
COPY . .

# 2. Agora, quando o prisma generate rodar, ele verá "debian-openssl-3.0.x"
# e gerará o Query Engine correto.
RUN npx prisma generate
RUN npm run build


# --- Estágio 2: Production ---
# Este é o contêiner final, enxuto e otimizado para produção.
FROM node:20-slim

WORKDIR /usr/src/app

# Instale o OpenSSL aqui também para garantir um ambiente correspondente.
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copia os arquivos de dependência do estágio de build.
COPY --from=builder /usr/src/app/package*.json ./

# Copia a pasta node_modules inteira do estágio builder.
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia a pasta 'dist' inteira, que contém seu app compilado.
COPY --from=builder /usr/src/app/dist ./dist

# Copia o schema do Prisma, necessário em tempo de execução.
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

# O comando padrão para INICIAR O SERVIÇO.
CMD ["npm", "start"]
