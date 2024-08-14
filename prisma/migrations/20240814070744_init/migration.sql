/*
  Warnings:

  - Changed the type of `type` on the `packages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('MONTHLY', 'ANNUALLY');

-- DropIndex
DROP INDEX "packages_type_key";

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "advantages" JSONB,
ADD COLUMN     "is_bestseller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "old_price" DECIMAL(65,30),
DROP COLUMN "type",
ADD COLUMN     "type" "PackageType" NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);
