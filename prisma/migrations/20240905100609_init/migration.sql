/*
  Warnings:

  - You are about to alter the column `address` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `link` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `home_code` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `counties` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `counties` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `type` on the `deposits` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `amount` on the `deposits` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,4)`.
  - You are about to alter the column `status` on the `deposits` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `payment_id` on the `deposits` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `question` on the `faq` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `answer` on the `faq` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `asking` on the `favorite_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to alter the column `cashflow` on the `favorite_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to alter the column `down` on the `favorite_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to alter the column `offer` on the `favorite_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to alter the column `repairs` on the `favorite_addresses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to alter the column `name` on the `metropolitans` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `packages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `payment_systems` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `merchant` on the `payment_systems` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `type` on the `referral_bonuses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `amount` on the `referral_bonuses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,4)`.
  - You are about to alter the column `name` on the `states` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `static_pages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `static_pages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `code` on the `zip_codes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "address" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "link" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "home_code" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "blogs" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "image" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "counties" ALTER COLUMN "code" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "type" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "status" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "payment_id" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "faq" ALTER COLUMN "question" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "answer" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "favorite_addresses" ALTER COLUMN "asking" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "cashflow" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "down" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "offer" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "repairs" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "metropolitans" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "payment_systems" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "merchant" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "referral_bonuses" ALTER COLUMN "type" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,4);

-- AlterTable
ALTER TABLE "states" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "static_pages" ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" SET DATA TYPE VARCHAR,
ALTER COLUMN "last_name" SET DATA TYPE VARCHAR,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "zip_codes" ALTER COLUMN "code" SET DATA TYPE VARCHAR(255);
