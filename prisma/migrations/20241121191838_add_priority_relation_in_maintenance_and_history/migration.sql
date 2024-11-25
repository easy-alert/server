-- AlterTable
ALTER TABLE "maintenances" ADD COLUMN     "priorityName" "MaintenancePriorityName" NOT NULL DEFAULT 'low';

-- AlterTable
ALTER TABLE "maintenancesHistory" ADD COLUMN     "priorityName" "MaintenancePriorityName" NOT NULL DEFAULT 'low';

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_priorityName_fkey" FOREIGN KEY ("priorityName") REFERENCES "maintenancePriorities"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_priorityName_fkey" FOREIGN KEY ("priorityName") REFERENCES "maintenancePriorities"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
