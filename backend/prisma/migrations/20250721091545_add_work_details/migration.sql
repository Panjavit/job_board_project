-- CreateEnum
CREATE TYPE "WorkArrangement" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "workArrangement" "WorkArrangement" DEFAULT 'ONSITE',
ADD COLUMN     "workPolicy" TEXT,
ADD COLUMN     "workingDays" TEXT,
ADD COLUMN     "workingHours" TEXT;
