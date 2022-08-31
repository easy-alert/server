/*
  Warnings:

  - You are about to drop the column `ownerId` on the `companies` table. All the data in the column will be lost.
  - Added the required column `userId` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "ownerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
