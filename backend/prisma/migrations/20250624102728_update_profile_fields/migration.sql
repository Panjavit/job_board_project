/*
  Warnings:

  - You are about to drop the column `youtubeIntroLink` on the `CandidateProfile` table. All the data in the column will be lost.
  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_candidateProfileId_fkey";

-- AlterTable
ALTER TABLE "CandidateProfile" DROP COLUMN "youtubeIntroLink",
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "projects" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- DropTable
DROP TABLE "License";

-- CreateTable
CREATE TABLE "CertificateFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,

    CONSTRAINT "CertificateFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,

    CONSTRAINT "ContactFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CertificateFile" ADD CONSTRAINT "CertificateFile_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactFile" ADD CONSTRAINT "ContactFile_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
