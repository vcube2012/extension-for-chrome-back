-- CreateTable
CREATE TABLE "stripe" (
    "id" TEXT NOT NULL,
    "stripe_id" VARCHAR NOT NULL,
    "stripe_type" VARCHAR(255) NOT NULL,
    "model_type" VARCHAR(255) NOT NULL,
    "model_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "stripe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_stripe_id_key" ON "stripe"("stripe_id");
