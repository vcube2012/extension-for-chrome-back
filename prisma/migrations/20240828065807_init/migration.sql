/*
  Warnings:

  - A unique constraint covering the columns `[type,name]` on the table `packages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'monthly';

-- CreateIndex
CREATE UNIQUE INDEX "packages_type_name_key" ON "packages"("type", "name");
