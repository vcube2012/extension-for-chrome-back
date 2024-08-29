-- AlterTable
ALTER TABLE "payment_systems" ADD COLUMN     "is_card" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "merchant" SET DATA TYPE VARCHAR;
