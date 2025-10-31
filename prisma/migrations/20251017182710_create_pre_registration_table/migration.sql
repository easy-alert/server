-- CreateEnum
CREATE TYPE "PreRegistrationStatus" AS ENUM ('pending', 'completed', 'expired');

-- CreateEnum
CREATE TYPE "clientType" AS ENUM ('residentSyndic', 'professionalSyndic', 'constructionCompany', 'administrationCompany', 'others');

-- CreateEnum
CREATE TYPE "planType" AS ENUM ('annual', 'monthly');

-- CreateTable
CREATE TABLE "preRegistration" (
    "id" TEXT NOT NULL,
    "status" "PreRegistrationStatus" NOT NULL DEFAULT 'pending',
    "clientType" "clientType" NOT NULL,
    "buildingQuantity" INTEGER NOT NULL,
    "planType" "planType" NOT NULL,
    "monthlyPrice" DOUBLE PRECISION NOT NULL,
    "implementationPrice" DOUBLE PRECISION NOT NULL,
    "createdUserId" TEXT,
    "createdCompanyId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "preRegistration_id_key" ON "preRegistration"("id");

-- CreateIndex
CREATE UNIQUE INDEX "preRegistration_createdUserId_key" ON "preRegistration"("createdUserId");

-- CreateIndex
CREATE UNIQUE INDEX "preRegistration_createdCompanyId_key" ON "preRegistration"("createdCompanyId");

-- AddForeignKey
ALTER TABLE "preRegistration" ADD CONSTRAINT "preRegistration_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preRegistration" ADD CONSTRAINT "preRegistration_createdCompanyId_fkey" FOREIGN KEY ("createdCompanyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
