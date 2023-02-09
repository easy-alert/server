/*
  Warnings:

  - Made the column `dueDate` on table `maintenancesHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "maintenancesHistory" ALTER COLUMN "dueDate" SET NOT NULL;
