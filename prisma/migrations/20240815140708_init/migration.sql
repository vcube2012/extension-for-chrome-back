-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referrer_id" INTEGER;

-- CreateTable
CREATE TABLE "referral_bonuses" (
    "id" BIGSERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "partner_id" INTEGER NOT NULL,
    "referral_id" INTEGER,
    "percent" SMALLINT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "referral_bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referral_bonuses_partner_id_idx" ON "referral_bonuses"("partner_id");

-- CreateIndex
CREATE INDEX "referral_bonuses_referral_id_idx" ON "referral_bonuses"("referral_id");

-- CreateIndex
CREATE INDEX "users_referrer_id_idx" ON "users"("referrer_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_bonuses" ADD CONSTRAINT "referral_bonuses_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
