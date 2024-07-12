/*
  Warnings:

  - You are about to drop the `zip_code_county` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zip_code_metropolitan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "zip_code_county" DROP CONSTRAINT "zip_code_county_countyId_fkey";

-- DropForeignKey
ALTER TABLE "zip_code_county" DROP CONSTRAINT "zip_code_county_zipCodeId_fkey";

-- DropForeignKey
ALTER TABLE "zip_code_metropolitan" DROP CONSTRAINT "zip_code_metropolitan_metropolitanId_fkey";

-- DropForeignKey
ALTER TABLE "zip_code_metropolitan" DROP CONSTRAINT "zip_code_metropolitan_zipCodeId_fkey";

-- DropTable
DROP TABLE "zip_code_county";

-- DropTable
DROP TABLE "zip_code_metropolitan";

-- CreateTable
CREATE TABLE "_MetropolitanToZipCode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CountyToZipCode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MetropolitanToZipCode_AB_unique" ON "_MetropolitanToZipCode"("A", "B");

-- CreateIndex
CREATE INDEX "_MetropolitanToZipCode_B_index" ON "_MetropolitanToZipCode"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountyToZipCode_AB_unique" ON "_CountyToZipCode"("A", "B");

-- CreateIndex
CREATE INDEX "_CountyToZipCode_B_index" ON "_CountyToZipCode"("B");

-- AddForeignKey
ALTER TABLE "_MetropolitanToZipCode" ADD CONSTRAINT "_MetropolitanToZipCode_A_fkey" FOREIGN KEY ("A") REFERENCES "metropolitans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetropolitanToZipCode" ADD CONSTRAINT "_MetropolitanToZipCode_B_fkey" FOREIGN KEY ("B") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToZipCode" ADD CONSTRAINT "_CountyToZipCode_A_fkey" FOREIGN KEY ("A") REFERENCES "counties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToZipCode" ADD CONSTRAINT "_CountyToZipCode_B_fkey" FOREIGN KEY ("B") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
