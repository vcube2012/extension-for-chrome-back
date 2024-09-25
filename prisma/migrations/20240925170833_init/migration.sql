/*
  Warnings:

  - Added the required column `page` to the `blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blocks" ADD COLUMN     "page" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "blocks_page_idx" ON "blocks"("page");
