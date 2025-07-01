import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", protect, authorize("CANDIDATE"), async (req, res) => {
  try {
    const {
      positionOfInterest,
      universityName,
      startDate,
      endDate,
      reason,
      internshipType,
    } = req.body;

    //ใช้ Transaction เพื่อรัน 2 คำสั่งพร้อมกัน
    const result = await prisma.$transaction(async (tx) => {
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
        internshipType,
      };

      let savedApplication;
      if (existingApplication) {
        savedApplication = await tx.internshipApplication.update({
          where: { id: existingApplication.id },
          data: applicationData,
        });
      } else {

        const prefix = positionOfInterest
          .replace(/[^a-zA-Z]/g, "") //เอาเฉพาะตัวอักษรภาษาอังกฤษ
          .substring(0, 6)
          .toUpperCase();

        //นับว่ามีคนใช้ Prefix นี้ไปแล้วกี่คน
        const count = await tx.candidateProfile.count({
          where: {
            studentCode: {
              startsWith: prefix,
            },
          },
        });

        //สร้างรหัสใหม่โดยนำ Prefix มาต่อกับลำดับ + 1 (พร้อมเติม 0 ข้างหน้า)
        //เช่น "BACKEN" + "01" -> "BACKEN01"
        const studentCode = `${prefix}${String(count + 1).padStart(2, "0")}`;

        //บันทึกรหัสที่สร้างขึ้นใหม่นี้ลงในโปรไฟล์ของนักศึกษา
        await tx.candidateProfile.update({
          where: { id: req.user.profileId },
          data: { studentCode: studentCode },
        });
        
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
