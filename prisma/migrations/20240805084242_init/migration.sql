/*
  Warnings:

  - Added the required column `link` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "link" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tag" (
    "user_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tag_pkey" PRIMARY KEY ("user_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
