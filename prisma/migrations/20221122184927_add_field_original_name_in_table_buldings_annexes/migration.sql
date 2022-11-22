/*
  Warnings:

  - Added the required column `originalName` to the `buildingsAnnexes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "buildingsAnnexes" ADD COLUMN     "originalName" TEXT NOT NULL;
