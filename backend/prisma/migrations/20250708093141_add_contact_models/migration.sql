/*
  Warnings:

  - You are about to drop the column `contactInstructions` on the `CompanyProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" DROP COLUMN "contactInstructions";

-- CreateTable
CREATE TABLE "CompanyEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,

    CONSTRAINT "CompanyEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyPhone" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,

    CONSTRAINT "CompanyPhone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyEmail" ADD CONSTRAINT "CompanyEmail_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyPhone" ADD CONSTRAINT "CompanyPhone_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
