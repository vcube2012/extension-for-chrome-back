/*
  Warnings:

  - A unique constraint covering the columns `[zip_code_id,address]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_zip_code_id_address_key" ON "addresses"("zip_code_id", "address");
