/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `packages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");
