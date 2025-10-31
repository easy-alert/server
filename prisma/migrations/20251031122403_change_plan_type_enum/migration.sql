/*
  Warnings:

  - The values [monthly] on the enum `planType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "planType_new" AS ENUM ('annual', 'semester');
ALTER TABLE "preRegistration" ALTER COLUMN "planType" TYPE "planType_new" USING ("planType"::text::"planType_new");
ALTER TYPE "planType" RENAME TO "planType_old";
ALTER TYPE "planType_new" RENAME TO "planType";
DROP TYPE "planType_old";
COMMIT;
