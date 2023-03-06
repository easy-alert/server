/*
  Warnings:

  - You are about to drop the `oldUserIds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "oldUserIds" DROP CONSTRAINT "oldUserIds_buildingId_fkey";

-- DropTable
DROP TABLE "oldUserIds";

-- CreateTable
CREATE TABLE "oldBuildingIds" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "oldBuildingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oldBuildingIds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oldBuildingIds_id_key" ON "oldBuildingIds"("id");

-- AddForeignKey
ALTER TABLE "oldBuildingIds" ADD CONSTRAINT "oldBuildingIds_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
