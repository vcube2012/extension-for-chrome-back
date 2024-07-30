-- DropIndex
DROP INDEX "addresses_zip_code_id_address_key";

-- CreateTable
CREATE TABLE "favorite_addresses" (
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "info" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_addresses_user_id_address_id_key" ON "favorite_addresses"("user_id", "address_id");

-- AddForeignKey
ALTER TABLE "favorite_addresses" ADD CONSTRAINT "favorite_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_addresses" ADD CONSTRAINT "favorite_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
