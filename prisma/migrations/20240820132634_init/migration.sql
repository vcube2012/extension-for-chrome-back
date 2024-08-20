/*
  Warnings:

  - The primary key for the `package_user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "package_user" DROP CONSTRAINT "package_user_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "package_user_pkey" PRIMARY KEY ("id");
