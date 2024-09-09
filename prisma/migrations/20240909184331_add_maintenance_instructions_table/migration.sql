-- CreateTable
CREATE TABLE "maintenanceInstructions" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "maintenanceInstructions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenanceInstructions" ADD CONSTRAINT "maintenanceInstructions_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "maintenances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
