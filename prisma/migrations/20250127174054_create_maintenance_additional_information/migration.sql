-- CreateTable
CREATE TABLE "maintenanceAdditionalInformations" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "information" TEXT NOT NULL,

    CONSTRAINT "maintenanceAdditionalInformations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceAdditionalInformations_id_key" ON "maintenanceAdditionalInformations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceAdditionalInformations_buildingId_maintenanceId_key" ON "maintenanceAdditionalInformations"("buildingId", "maintenanceId");

-- AddForeignKey
ALTER TABLE "maintenanceAdditionalInformations" ADD CONSTRAINT "maintenanceAdditionalInformations_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenanceAdditionalInformations" ADD CONSTRAINT "maintenanceAdditionalInformations_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
