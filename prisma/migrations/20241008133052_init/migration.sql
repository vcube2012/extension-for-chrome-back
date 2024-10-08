/*
  Warnings:

  - Added the required column `created_at` to the `package_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `package_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "package_user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;
