-- CreateTable
CREATE TABLE "pushNotifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pushNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pushNotifications_id_key" ON "pushNotifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pushNotifications_token_key" ON "pushNotifications"("token");

-- AddForeignKey
ALTER TABLE "pushNotifications" ADD CONSTRAINT "pushNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
