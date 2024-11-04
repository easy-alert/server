/*
  Warnings:

  - You are about to drop the column `label` on the `serviceTypes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `serviceTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "serviceTypes_label_key";

-- AlterTable
ALTER TABLE "serviceTypes" DROP COLUMN "label",
ADD COLUMN     "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "name" TEXT,
ADD COLUMN     "pluralLabel" TEXT NOT NULL DEFAULT 'Serviços',
ADD COLUMN     "singularLabel" TEXT NOT NULL DEFAULT 'Serviço';

-- CreateIndex
CREATE UNIQUE INDEX "serviceTypes_name_key" ON "serviceTypes"("name");
