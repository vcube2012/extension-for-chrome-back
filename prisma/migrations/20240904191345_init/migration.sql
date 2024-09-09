/*
  Warnings:

  - Added the required column `stripe_type` to the `stripe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stripe" ADD COLUMN     "stripe_type" VARCHAR(255) NOT NULL;
