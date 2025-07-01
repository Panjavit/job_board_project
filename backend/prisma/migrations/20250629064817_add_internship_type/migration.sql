-- CreateEnum
CREATE TYPE "InternshipType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP');

-- AlterTable
ALTER TABLE "InternshipApplication" ADD COLUMN     "internshipType" "InternshipType" NOT NULL DEFAULT 'INTERNSHIP';
