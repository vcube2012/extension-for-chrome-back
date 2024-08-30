/*
  Warnings:

  - A unique constraint covering the columns `[home_code,zip_code_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_home_code_zip_code_id_key" ON "addresses"("home_code", "zip_code_id");
