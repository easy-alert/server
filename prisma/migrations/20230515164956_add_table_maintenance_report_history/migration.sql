-- CreateTable
CREATE TABLE "maintenancesReportsHistory" (
    "id" TEXT NOT NULL,
    "maintenanceHistoryId" TEXT NOT NULL,
    "observation" TEXT,
    "cost" DOUBLE PRECISION,
    "responsibleSyndicId" TEXT,
    "maintenanceReportId" TEXT NOT NULL,
    "version" DOUBLE PRECISION NOT NULL DEFAULT 1.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesReportsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancesReportsAnnexesHistory" (
    "id" TEXT NOT NULL,
    "maintenanceReportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesReportsAnnexesHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancesReportsImagesHistory" (
    "id" TEXT NOT NULL,
    "maintenanceReportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesReportsImagesHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesReportsHistory_id_key" ON "maintenancesReportsHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesReportsAnnexesHistory_id_key" ON "maintenancesReportsAnnexesHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesReportsImagesHistory_id_key" ON "maintenancesReportsImagesHistory"("id");

-- AddForeignKey
ALTER TABLE "maintenancesReportsHistory" ADD CONSTRAINT "maintenancesReportsHistory_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "maintenancesReports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsHistory" ADD CONSTRAINT "maintenancesReportsHistory_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsHistory" ADD CONSTRAINT "maintenancesReportsHistory_responsibleSyndicId_fkey" FOREIGN KEY ("responsibleSyndicId") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsAnnexesHistory" ADD CONSTRAINT "maintenancesReportsAnnexesHistory_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "maintenancesReportsHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsImagesHistory" ADD CONSTRAINT "maintenancesReportsImagesHistory_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "maintenancesReportsHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
