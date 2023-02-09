-- CreateTable
CREATE TABLE "maintenancesReports" (
    "id" TEXT NOT NULL,
    "maintenanceHistoryId" TEXT NOT NULL,
    "observation" TEXT,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancesReportsAnnexes" (
    "id" TEXT NOT NULL,
    "maintenanceReportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesReportsAnnexes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenancesReportsImages" (
    "id" TEXT NOT NULL,
    "maintenanceReportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenancesReportsImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesReports_id_key" ON "maintenancesReports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesReportsAnnexes_id_key" ON "maintenancesReportsAnnexes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenancesReportsImages_id_key" ON "maintenancesReportsImages"("id");

-- AddForeignKey
ALTER TABLE "maintenancesReports" ADD CONSTRAINT "maintenancesReports_maintenanceHistoryId_fkey" FOREIGN KEY ("maintenanceHistoryId") REFERENCES "maintenancesHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsAnnexes" ADD CONSTRAINT "maintenancesReportsAnnexes_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "maintenancesReports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesReportsImages" ADD CONSTRAINT "maintenancesReportsImages_maintenanceReportId_fkey" FOREIGN KEY ("maintenanceReportId") REFERENCES "maintenancesReports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
