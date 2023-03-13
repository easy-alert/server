-- CreateTable
CREATE TABLE "oldUserIds" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "oldUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oldUserIds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oldUserIds_id_key" ON "oldUserIds"("id");

-- AddForeignKey
ALTER TABLE "oldUserIds" ADD CONSTRAINT "oldUserIds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
