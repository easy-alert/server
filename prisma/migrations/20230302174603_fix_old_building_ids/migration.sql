/*
  Warnings:

  - You are about to drop the column `oldUserId` on the `oldUserIds` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `oldUserIds` table. All the data in the column will be lost.
  - Added the required column `buildingId` to the `oldUserIds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldBuildingId` to the `oldUserIds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "oldUserIds" DROP CONSTRAINT "oldUserIds_userId_fkey";

-- AlterTable
ALTER TABLE "oldUserIds" DROP COLUMN "oldUserId",
DROP COLUMN "userId",
ADD COLUMN     "buildingId" TEXT NOT NULL,
ADD COLUMN     "oldBuildingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "oldUserIds" ADD CONSTRAINT "oldUserIds_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
