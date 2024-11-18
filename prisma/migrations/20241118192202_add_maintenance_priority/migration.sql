-- CreateEnum
CREATE TYPE "MaintenancePriorityName" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "maintenancePriorities" (
    "name" "MaintenancePriorityName" NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,

    CONSTRAINT "maintenancePriorities_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenancePriorities_label_key" ON "maintenancePriorities"("label");
