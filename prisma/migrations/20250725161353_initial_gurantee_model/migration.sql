-- CreateTable
CREATE TABLE "guaranteeSystems" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guaranteeSystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guaranteeFailureTypes" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guaranteeFailureTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guaranteeDocuments" (
    "id" TEXT NOT NULL,
    "guaranteeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guaranteeDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guaranteeToFailureTypes" (
    "id" TEXT NOT NULL,
    "guaranteeId" TEXT NOT NULL,
    "failureTypeId" TEXT NOT NULL,

    CONSTRAINT "guaranteeToFailureTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guarantees" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "buildingId" TEXT,
    "systemId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "standardWarrantyPeriod" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guarantees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guaranteeSystems_name_key" ON "guaranteeSystems"("name");

-- CreateIndex
CREATE UNIQUE INDEX "guaranteeSystems_companyId_name_key" ON "guaranteeSystems"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "guaranteeFailureTypes_companyId_name_key" ON "guaranteeFailureTypes"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "guaranteeToFailureTypes_guaranteeId_failureTypeId_key" ON "guaranteeToFailureTypes"("guaranteeId", "failureTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "guarantees_companyId_systemId_description_standardWarrantyP_key" ON "guarantees"("companyId", "systemId", "description", "standardWarrantyPeriod");

-- AddForeignKey
ALTER TABLE "guaranteeSystems" ADD CONSTRAINT "guaranteeSystems_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guaranteeFailureTypes" ADD CONSTRAINT "guaranteeFailureTypes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guaranteeDocuments" ADD CONSTRAINT "guaranteeDocuments_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guaranteeToFailureTypes" ADD CONSTRAINT "guaranteeToFailureTypes_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guaranteeToFailureTypes" ADD CONSTRAINT "guaranteeToFailureTypes_failureTypeId_fkey" FOREIGN KEY ("failureTypeId") REFERENCES "guaranteeFailureTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarantees" ADD CONSTRAINT "guarantees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarantees" ADD CONSTRAINT "guarantees_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarantees" ADD CONSTRAINT "guarantees_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "guaranteeSystems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
