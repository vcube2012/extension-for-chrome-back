/*
  Warnings:

  - You are about to drop the column `info` on the `favorite_addresses` table. All the data in the column will be lost.
  - Added the required column `asking` to the `favorite_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cashflow` to the `favorite_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `down` to the `favorite_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offer` to the `favorite_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repairs` to the `favorite_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_zip_code_id_fkey";

-- DropForeignKey
ALTER TABLE "counties" DROP CONSTRAINT "counties_state_id_fkey";

-- DropForeignKey
ALTER TABLE "county_zip_code" DROP CONSTRAINT "county_zip_code_county_id_fkey";

-- DropForeignKey
ALTER TABLE "county_zip_code" DROP CONSTRAINT "county_zip_code_zip_code_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_addresses" DROP CONSTRAINT "favorite_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_addresses" DROP CONSTRAINT "favorite_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "metropolitan_zip_code" DROP CONSTRAINT "metropolitan_zip_code_metropolitan_id_fkey";

-- DropForeignKey
ALTER TABLE "metropolitan_zip_code" DROP CONSTRAINT "metropolitan_zip_code_zip_code_id_fkey";

-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tag_favorite_address" DROP CONSTRAINT "tag_favorite_address_address_id_fkey";

-- DropForeignKey
ALTER TABLE "tag_favorite_address" DROP CONSTRAINT "tag_favorite_address_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "tag_favorite_address" DROP CONSTRAINT "tag_favorite_address_user_id_address_id_fkey";

-- DropForeignKey
ALTER TABLE "tag_favorite_address" DROP CONSTRAINT "tag_favorite_address_user_id_fkey";

-- AlterTable
ALTER TABLE "favorite_addresses" DROP COLUMN "info",
ADD COLUMN     "asking" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "cashflow" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "down" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "offer" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "repairs" DECIMAL(65,30) NOT NULL;

-- AddForeignKey
ALTER TABLE "counties" ADD CONSTRAINT "counties_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "county_zip_code" ADD CONSTRAINT "county_zip_code_zip_code_id_fkey" FOREIGN KEY ("zip_code_id") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "county_zip_code" ADD CONSTRAINT "county_zip_code_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "counties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metropolitan_zip_code" ADD CONSTRAINT "metropolitan_zip_code_zip_code_id_fkey" FOREIGN KEY ("zip_code_id") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metropolitan_zip_code" ADD CONSTRAINT "metropolitan_zip_code_metropolitan_id_fkey" FOREIGN KEY ("metropolitan_id") REFERENCES "metropolitans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_zip_code_id_fkey" FOREIGN KEY ("zip_code_id") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_addresses" ADD CONSTRAINT "favorite_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_addresses" ADD CONSTRAINT "favorite_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_favorite_address" ADD CONSTRAINT "tag_favorite_address_user_id_address_id_fkey" FOREIGN KEY ("user_id", "address_id") REFERENCES "favorite_addresses"("user_id", "address_id") ON DELETE CASCADE ON UPDATE CASCADE;
