-- AlterTable
ALTER TABLE "package_user" ADD COLUMN     "is_trial" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "is_trial" BOOLEAN NOT NULL DEFAULT false;
