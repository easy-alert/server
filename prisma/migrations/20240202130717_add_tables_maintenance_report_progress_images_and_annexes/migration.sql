-- CreateTable
CREATE TABLE "maintenanceReportProgresses" (
    "id" TEXT NOT NULL,
    "maintenanceHistoryId" TEXT NOT NULL,
    "observation" TEXT,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceReportProgresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenanceReportAnnexesProgresses" (
    "id" TEXT NOT NULL,
    "maintenanceReportProgressId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceReportAnnexesProgresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenanceReportImagesProgresses" (
    "id" TEXT NOT NULL,
    "maintenanceReportProgressId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceReportImagesProgresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceReportProgresses_id_key" ON "maintenanceReportProgresses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceReportProgresses_maintenanceHistoryId_key" ON "maintenanceReportProgresses"("maintenanceHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceReportAnnexesProgresses_id_key" ON "maintenanceReportAnnexesProgresses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenanceReportImagesProgresses_id_key" ON "maintenanceReportImagesProgresses"("id");

-- AddForeignKey
ALTER TABLE "maintenanceReportProgresses" ADD CONSTRAINT "maintenanceReportProgresses_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenanceReportAnnexesProgresses" ADD CONSTRAINT "maintenanceReportAnnexesProgresses_maintenanceReportProgre_fkey" FOREIGN KEY ("maintenanceReportProgressId") REFERENCES "maintenanceReportProgresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenanceReportImagesProgresses" ADD CONSTRAINT "maintenanceReportImagesProgresses_maintenanceReportProgres_fkey" FOREIGN KEY ("maintenanceReportProgressId") REFERENCES "maintenanceReportProgresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
