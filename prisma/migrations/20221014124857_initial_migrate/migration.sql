-- Habilita a extensão para geração de UUIDs, se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,
    "lastAccess" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userPermissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCompanies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "owner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "CNPJ" TEXT,
    "CPF" TEXT,
    "contactNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "ownerCompanyId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "ownerCompanyId" TEXT,
    "element" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "frequencyTimeIntervalId" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "periodTimeIntervalId" TEXT NOT NULL,
    "delay" INTEGER NOT NULL,
    "delayTimeIntervalId" TEXT NOT NULL,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeIntervals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "singularLabel" TEXT NOT NULL,
    "pluralLabel" TEXT NOT NULL,
    "unitTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeIntervals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userPermissions_id_key" ON "userPermissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "userCompanies_id_key" ON "userCompanies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_id_key" ON "permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_id_key" ON "companies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_CNPJ_key" ON "companies"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "companies_CPF_key" ON "companies"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_key" ON "categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenances_id_key" ON "maintenances"("id");

-- CreateIndex
CREATE UNIQUE INDEX "timeIntervals_id_key" ON "timeIntervals"("id");

-- CreateIndex
CREATE UNIQUE INDEX "timeIntervals_name_key" ON "timeIntervals"("name");

-- CreateIndex
CREATE UNIQUE INDEX "timeIntervals_singularLabel_key" ON "timeIntervals"("singularLabel");

-- CreateIndex
CREATE UNIQUE INDEX "timeIntervals_pluralLabel_key" ON "timeIntervals"("pluralLabel");

-- AddForeignKey
ALTER TABLE "userPermissions" ADD CONSTRAINT "userPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userPermissions" ADD CONSTRAINT "userPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompanies" ADD CONSTRAINT "userCompanies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompanies" ADD CONSTRAINT "userCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_ownerCompanyId_fkey" FOREIGN KEY ("ownerCompanyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_ownerCompanyId_fkey" FOREIGN KEY ("ownerCompanyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_frequencyTimeIntervalId_fkey" FOREIGN KEY ("frequencyTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_periodTimeIntervalId_fkey" FOREIGN KEY ("periodTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_delayTimeIntervalId_fkey" FOREIGN KEY ("delayTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
