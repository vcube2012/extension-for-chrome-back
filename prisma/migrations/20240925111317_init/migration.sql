/*
  Warnings:

  - Added the required column `name` to the `blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
