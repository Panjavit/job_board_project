-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "InternshipApplication" (
    "id" TEXT NOT NULL,
    "positionOfInterest" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candidateProfileId" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,

    CONSTRAINT "InternshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternshipApplication_candidateProfileId_companyProfileId_key" ON "InternshipApplication"("candidateProfileId", "companyProfileId");

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipApplication" ADD CONSTRAINT "InternshipApplication_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
