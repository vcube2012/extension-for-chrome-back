-- DropForeignKey
ALTER TABLE "package_user" DROP CONSTRAINT "package_user_package_id_fkey";

-- DropForeignKey
ALTER TABLE "package_user" DROP CONSTRAINT "package_user_user_id_fkey";

-- AddForeignKey
ALTER TABLE "package_user" ADD CONSTRAINT "package_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_user" ADD CONSTRAINT "package_user_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
