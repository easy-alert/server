/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "checklists" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "maintenanceAdditionalInformations" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "maintenancesHistory" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "dismissedByUserId" TEXT;

-- AlterTable
ALTER TABLE "userBuildingsPermissions" ADD COLUMN     "isMainContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showContact" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailIsConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isMainContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phoneNumberIsConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "showContact" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_phoneNumber_key" ON "users"("email", "phoneNumber");

-- AddForeignKey
ALTER TABLE "maintenanceAdditionalInformations" ADD CONSTRAINT "maintenanceAdditionalInformations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenancesHistory" ADD CONSTRAINT "maintenancesHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_dismissedByUserId_fkey" FOREIGN KEY ("dismissedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
