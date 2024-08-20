-- CreateTable
CREATE TABLE "payment_systems" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "merchant" TEXT NOT NULL,
    "min_deposit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL,
    "sort_order" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payment_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_system_id" INTEGER NOT NULL,
    "type" VARCHAR NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR NOT NULL,
    "payment_id" VARCHAR,
    "error" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_systems_merchant_key" ON "payment_systems"("merchant");

-- CreateIndex
CREATE INDEX "deposits_type_idx" ON "deposits"("type");

-- AddForeignKey
ALTER TABLE "referral_bonuses" ADD CONSTRAINT "referral_bonuses_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_payment_system_id_fkey" FOREIGN KEY ("payment_system_id") REFERENCES "payment_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
