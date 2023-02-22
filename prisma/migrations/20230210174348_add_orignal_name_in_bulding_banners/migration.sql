/*
  Warnings:

  - You are about to drop the column `name` on the `buildingsBanners` table. All the data in the column will be lost.
  - Added the required column `bannerName` to the `buildingsBanners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `buildingsBanners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "buildingsBanners" DROP COLUMN "name",
ADD COLUMN     "bannerName" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL;
