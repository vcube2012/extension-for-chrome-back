/*
  Warnings:

  - You are about to drop the column `prices` on the `zip_codes` table. All the data in the column will be lost.
  - Added the required column `price` to the `zip_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zip_codes" DROP COLUMN "prices",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
