-- CreateTable
CREATE TABLE "buildingsNotificationsConfigurations" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailIsConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "contactNumberIsConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingsNotificationsConfigurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildingsNotificationsConfigurations_id_key" ON "buildingsNotificationsConfigurations"("id");

-- AddForeignKey
ALTER TABLE "buildingsNotificationsConfigurations" ADD CONSTRAINT "buildingsNotificationsConfigurations_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
