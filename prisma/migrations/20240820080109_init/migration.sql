/*
  Warnings:

  - Added the required column `package_id` to the `deposits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deposits" ADD COLUMN     "package_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "payment_systems" ALTER COLUMN "name" SET DATA TYPE VARCHAR;

-- CreateTable
CREATE TABLE "package_user" (
    "package_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "package_user_pkey" PRIMARY KEY ("package_id","user_id")
);

-- AddForeignKey
ALTER TABLE "package_user" ADD CONSTRAINT "package_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_user" ADD CONSTRAINT "package_user_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
