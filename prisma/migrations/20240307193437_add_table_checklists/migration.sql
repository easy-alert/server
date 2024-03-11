-- CreateTable
CREATE TABLE "checklists" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "syndicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "frequency" INTEGER,
    "frequencyTimeIntervalId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "buildingsNotificationsConfigurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_frequencyTimeIntervalId_fkey" FOREIGN KEY ("frequencyTimeIntervalId") REFERENCES "timeIntervals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "checklists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
