/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `serviceTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "serviceTypes" ADD COLUMN     "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "name" TEXT,
ADD COLUMN     "pluralLabel" TEXT NOT NULL DEFAULT 'Serviços',
ADD COLUMN     "singularLabel" TEXT NOT NULL DEFAULT 'Serviço',
ALTER COLUMN "label" SET DEFAULT 'Serviços';

-- CreateIndex
CREATE UNIQUE INDEX "serviceTypes_name_key" ON "serviceTypes"("name");
