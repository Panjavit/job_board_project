/*
  Warnings:

  - You are about to drop the `InternshipApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InternshipApplication" DROP CONSTRAINT "InternshipApplication_candidateProfileId_fkey";

-- DropForeignKey
ALTER TABLE "InternshipApplication" DROP CONSTRAINT "InternshipApplication_companyProfileId_fkey";

-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "internshipType" "InternshipType" DEFAULT 'INTERNSHIP',
ADD COLUMN     "positionOfInterest" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "universityName" TEXT;

-- DropTable
DROP TABLE "InternshipApplication";

-- DropEnum
DROP TYPE "ApplicationStatus";
