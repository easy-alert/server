-- AlterTable
ALTER TABLE "tickets"
ADD COLUMN     "seen"               BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dismissObservation" TEXT,
ADD COLUMN     "dismissedBy"        TEXT,
ADD COLUMN     "dismissedAt"        TIMESTAMP(3);
