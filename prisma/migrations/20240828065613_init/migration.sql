/*
  Warnings:

  - You are about to drop the column `type` on the `packages` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "packages_type_name_key";

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "type";

-- DropEnum
DROP TYPE "PackageType";
