-- CreateTable
CREATE TABLE "maintenancesHistory" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "ownerCompanyId" TEXT NOT NULL,
    "maintenancesStatusId" TEXT NOT NULL,
    "notificationDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "resolutionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenacesStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "singularLabel" TEXT NOT NULL,
    "pluralLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenacesStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesHistory_id_key" ON "maintenancesHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenacesStatus_id_key" ON "maintenacesStatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenacesStatus_name_key" ON "maintenacesStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "maintenacesStatus_singularLabel_key" ON "maintenacesStatus"("singularLabel");

-- CreateIndex
CREATE UNIQUE INDEX "maintenacesStatus_pluralLabel_key" ON "maintenacesStatus"("pluralLabel");

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_ownerCompanyId_fkey" FOREIGN KEY ("ownerCompanyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_maintenancesStatusId_fkey" FOREIGN KEY ("maintenancesStatusId") REFERENCES "maintenacesStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
