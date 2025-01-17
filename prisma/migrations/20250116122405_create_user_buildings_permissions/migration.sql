-- CreateTable
CREATE TABLE "userBuildingsPermissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "permissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userBuildingsPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userBuildingsPermissions_id_key" ON "userBuildingsPermissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "userBuildingsPermissions_userId_buildingId_key" ON "userBuildingsPermissions"("userId", "buildingId");

-- AddForeignKey
ALTER TABLE "userBuildingsPermissions" ADD CONSTRAINT "userBuildingsPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBuildingsPermissions" ADD CONSTRAINT "userBuildingsPermissions_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBuildingsPermissions" ADD CONSTRAINT "userBuildingsPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
