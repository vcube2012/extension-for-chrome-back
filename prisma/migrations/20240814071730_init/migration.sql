/*
  Warnings:

  - You are about to drop the column `slug` on the `packages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,name]` on the table `packages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "packages_slug_key";

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "packages_type_name_key" ON "packages"("type", "name");
