/*
  Warnings:

  - You are about to drop the column `requests_limit` on the `packages` table. All the data in the column will be lost.
  - Added the required column `credits` to the `package_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credits` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "package_user" ADD COLUMN     "credits" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "requests_limit",
ADD COLUMN     "credits" INTEGER NOT NULL;
