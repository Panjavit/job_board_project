/*
  Warnings:

  - A unique constraint covering the columns `[companyProfileId,studentProfileId]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Interaction_companyProfileId_studentProfileId_key" ON "Interaction"("companyProfileId", "studentProfileId");
