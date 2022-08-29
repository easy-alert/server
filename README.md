# Default-Backend-Project

## 🚀 Clonando o repositório 🚀

Após clonar o repositório, partiremos para algumas informações básicas.

### 📋 O Projeto 📋

Os pacotes listados abaixo já estão configurados para facilitar e agilizar o desenvolvimento.

#### 📦 Pacotes 📦

- EditorConfig
- Eslint
- Prettier
- Husky
- LintStaged
- prettier
- Swagger

#### 🖥️ Tecnologias 🖥️

- NodeJS
- Typescript
- Prisma
- Express
- Postgres
- Helmet

### ⚙️ Executando o projeto

Qualquer configuração que necessite interferência do usuário acompanha o prefixo //CHANGE HERE

#### 🗂️ Estrutura de pastas 🗂️

```
> Grupo
  > Tipagens
  > Módulo
    > Controllers
      > Subgrupos
        > Funções
        > Rotas
  > Services
    > Classe de serviços
```

#### 🌎 Alterando .env 🌎

```
DATABASE_URL=postgresql://admin:admin@localhost:5432
JWT_SECRET=JWTSecret
AWS_ACCESS_KEY_ID=amazonKeyId
AWS_SECRET_ACCESS_KEY=amazonSecretAcessKey
AWS_S3_BUCKET=amazonBucket
```

#### 🧩 Configurando Cors 🧩

```
// CHANGE HERE
const allowedOrigins = [
  'urlDoSeuFrontEnd',
  'urlDoSeuFrontEnd'
];
```

## ✒️ Desenvolvido por

- [Ada Lovelace Software House](https://adasoftwarehouse.com.br)
