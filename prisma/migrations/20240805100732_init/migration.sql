/*
  Warnings:

  - You are about to drop the `user_tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_tag";

-- CreateTable
CREATE TABLE "tag_favorite_address" (
    "address_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_favorite_address_pkey" PRIMARY KEY ("address_id","user_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_user_id_address_id_fkey" FOREIGN KEY ("user_id", "address_id") REFERENCES "favorite_addresses"("user_id", "address_id") ON DELETE RESTRICT ON UPDATE CASCADE;
