/*
  Warnings:

  - Added the required column `fmr_info` to the `favorite_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "favorite_addresses" ADD COLUMN     "fmr_info" JSONB NOT NULL;
