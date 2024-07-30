-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "zip_code_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_zip_code_id_fkey" FOREIGN KEY ("zip_code_id") REFERENCES "zip_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
