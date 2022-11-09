-- CreateTable
CREATE TABLE "buildingsTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "buildingTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cep" TEXT,
    "city" TEXT,
    "state" TEXT,
    "neighborhood" TEXT,
    "streetName" TEXT,
    "area" TEXT,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "warrantyExpiration" TIMESTAMP(3) NOT NULL,
    "keepNotificationAfterWarrantyEnds" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingsCompanies" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildingsTypes_id_key" ON "buildingsTypes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "buildingsTypes_name_key" ON "buildingsTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_id_key" ON "buildings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "buildingsCompanies_id_key" ON "buildingsCompanies"("id");

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_buildingTypeId_fkey" FOREIGN KEY ("buildingTypeId") REFERENCES "buildingsTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsCompanies" ADD CONSTRAINT "buildingsCompanies_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingsCompanies" ADD CONSTRAINT "buildingsCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
