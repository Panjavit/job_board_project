/*
  Warnings:

  - A unique constraint covering the columns `[studentCode]` on the table `CandidateProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN     "studentCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_studentCode_key" ON "CandidateProfile"("studentCode");
