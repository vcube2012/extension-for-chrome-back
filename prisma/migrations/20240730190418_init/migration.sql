-- DropIndex
DROP INDEX "favorite_addresses_user_id_address_id_key";

-- AlterTable
ALTER TABLE "favorite_addresses" ADD CONSTRAINT "favorite_addresses_pkey" PRIMARY KEY ("user_id", "address_id");
