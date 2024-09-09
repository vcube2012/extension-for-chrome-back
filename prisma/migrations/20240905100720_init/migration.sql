/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `stripe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stripe_stripe_id_stripe_type_model_type_model_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "stripe_stripe_id_key" ON "stripe"("stripe_id");
