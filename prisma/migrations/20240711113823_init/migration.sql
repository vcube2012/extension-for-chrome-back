-- CreateTable
CREATE TABLE "zip_code_county" (
    "zipCodeId" INTEGER NOT NULL,
    "countyId" INTEGER NOT NULL,

    CONSTRAINT "zip_code_county_pkey" PRIMARY KEY ("countyId","zipCodeId")
);

-- CreateTable
CREATE TABLE "zip_code_metropolitan" (
    "zipCodeId" INTEGER NOT NULL,
    "metropolitanId" INTEGER NOT NULL,

    CONSTRAINT "zip_code_metropolitan_pkey" PRIMARY KEY ("metropolitanId","zipCodeId")
);

-- AddForeignKey
ALTER TABLE "zip_code_county" ADD CONSTRAINT "zip_code_county_zipCodeId_fkey" FOREIGN KEY ("zipCodeId") REFERENCES "zip_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zip_code_county" ADD CONSTRAINT "zip_code_county_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "counties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zip_code_metropolitan" ADD CONSTRAINT "zip_code_metropolitan_zipCodeId_fkey" FOREIGN KEY ("zipCodeId") REFERENCES "zip_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zip_code_metropolitan" ADD CONSTRAINT "zip_code_metropolitan_metropolitanId_fkey" FOREIGN KEY ("metropolitanId") REFERENCES "metropolitans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
