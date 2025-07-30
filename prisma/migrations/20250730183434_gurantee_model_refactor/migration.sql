-- AlterTable
ALTER TABLE "guarantees" ADD COLUMN     "observation" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;
