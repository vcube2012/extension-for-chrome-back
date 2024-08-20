-- AlterTable
ALTER TABLE "users" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "package_available_to" TIMESTAMP(3);
