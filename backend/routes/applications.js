import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", protect, authorize("CANDIDATE"), async (req, res) => {
  try {
    const { positionOfInterest, universityName, startDate, endDate, reason } =
      req.body;

    //ใช้ Transaction เพื่อรัน 2 คำสั่งพร้อมกัน
    const result = await prisma.$transaction(async (tx) => {
      // 1. อัปเดต desiredPosition ในโปรไฟล์หลักของผู้ใช้ (CandidateProfile)
      await tx.candidateProfile.update({
        where: { id: req.user.profileId },
        data: { desiredPosition: positionOfInterest },
      });

      //สร้างหรืออัปเดตใบสมัครฝึกงาน (InternshipApplication) (Logic เดิม)
      const ourCompany = await tx.companyProfile.findFirst({});
      if (!ourCompany) {
        throw new Error("ไม่พบข้อมูลบริษัทในระบบ");
      }

      const existingApplication = await tx.internshipApplication.findFirst({
        where: {
          candidateProfileId: req.user.profileId,
          companyProfileId: ourCompany.id,
        },
      });

      const applicationData = {
        positionOfInterest,
        universityName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      };

      let savedApplication;
      if (existingApplication) {
        savedApplication = await tx.internshipApplication.update({
          where: { id: existingApplication.id },
          data: applicationData,
        });
      } else {
        savedApplication = await tx.internshipApplication.create({
          data: {
            ...applicationData,
            candidateProfileId: req.user.profileId,
            companyProfileId: ourCompany.id,
          },
        });
      }

      return savedApplication;
    });

    res.status(200).json(result);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "คุณได้เคยสมัครฝึกงานไปแล้ว" });
    }
    console.error("Error saving application:", error);
    res.status(500).send("Server Error");
  }
});

export default router;
