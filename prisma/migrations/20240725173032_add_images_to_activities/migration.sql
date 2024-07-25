-- AlterTable
ALTER TABLE "maintenanceHistoryActivities" ALTER COLUMN "content" DROP NOT NULL;

-- CreateTable
CREATE TABLE "maintenanceHistoryActivityImages" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenanceHistoryActivityImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenanceHistoryActivityImages" ADD CONSTRAINT "maintenanceHistoryActivityImages_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "maintenanceHistoryActivities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
