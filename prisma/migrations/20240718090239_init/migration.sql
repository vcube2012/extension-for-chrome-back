-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requests_limit" INTEGER NOT NULL,
    "price" BIGINT NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metropolitans" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "metropolitans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "counties" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "counties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zip_codes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "code" TEXT NOT NULL,
    "prices" JSONB NOT NULL,

    CONSTRAINT "zip_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MetropolitanToZipCode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CountyToZipCode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "packages_type_key" ON "packages"("type");

-- CreateIndex
CREATE UNIQUE INDEX "metropolitans_code_key" ON "metropolitans"("code");

-- CreateIndex
CREATE UNIQUE INDEX "states_code_key" ON "states"("code");

-- CreateIndex
CREATE UNIQUE INDEX "counties_code_key" ON "counties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "zip_codes_code_key" ON "zip_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_MetropolitanToZipCode_AB_unique" ON "_MetropolitanToZipCode"("A", "B");

-- CreateIndex
CREATE INDEX "_MetropolitanToZipCode_B_index" ON "_MetropolitanToZipCode"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountyToZipCode_AB_unique" ON "_CountyToZipCode"("A", "B");

-- CreateIndex
CREATE INDEX "_CountyToZipCode_B_index" ON "_CountyToZipCode"("B");

-- AddForeignKey
ALTER TABLE "counties" ADD CONSTRAINT "counties_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetropolitanToZipCode" ADD CONSTRAINT "_MetropolitanToZipCode_A_fkey" FOREIGN KEY ("A") REFERENCES "metropolitans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetropolitanToZipCode" ADD CONSTRAINT "_MetropolitanToZipCode_B_fkey" FOREIGN KEY ("B") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToZipCode" ADD CONSTRAINT "_CountyToZipCode_A_fkey" FOREIGN KEY ("A") REFERENCES "counties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToZipCode" ADD CONSTRAINT "_CountyToZipCode_B_fkey" FOREIGN KEY ("B") REFERENCES "zip_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
