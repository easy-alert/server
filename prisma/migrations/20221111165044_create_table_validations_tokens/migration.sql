-- AlterTable
ALTER TABLE "buildingsNotificationsConfigurations" ADD COLUMN     "lastNotificationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "validationsTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "hasUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "validationsTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "validationsTokens_id_key" ON "validationsTokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "validationsTokens_token_key" ON "validationsTokens"("token");
