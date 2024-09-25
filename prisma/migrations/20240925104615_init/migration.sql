/*
  Warnings:

  - Added the required column `available_to` to the `package_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "package_user" ADD COLUMN     "available_to" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "blocks" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "blocks_pkey" PRIMARY KEY ("id")
);
