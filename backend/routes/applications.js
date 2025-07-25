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

    const dataToUpdate = {
      desiredPosition: positionOfInterest,
      positionOfInterest,
      universityName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      internshipType,
    };

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { id: req.user.profileId },
    });

    if (!candidateProfile) {
      return res.status(404).json({ message: 'ไม่พบโปรไฟล์' });
    }
    
    if (!candidateProfile.studentCode) {
      let isCodeSaved = false;
      let attempt = 0;
      const maxAttempts = 5;

      while (!isCodeSaved && attempt < maxAttempts) {
        try {
          const prefix = (positionOfInterest || 'CANDIDATE')
            .replace(/[^a-zA-Z]/g, "")
            .substring(0, 6)
            .toUpperCase();
          
          const count = await prisma.candidateProfile.count({
            where: { studentCode: { startsWith: prefix } },
          });
      
          const studentCode = `${prefix}${String(count + 1 + attempt).padStart(2, "0")}`;

          await prisma.candidateProfile.update({
            where: { id: req.user.profileId },
            data: { ...dataToUpdate, studentCode: studentCode },
          });

          isCodeSaved = true;

        } catch (error) {
          if (error.code === 'P2002' && error.meta?.target?.includes('studentCode')) {
            attempt++; 
          } else {
            throw error;
          }
        }
      }

      if (!isCodeSaved) {
        throw new Error('ไม่สามารถสร้างรหัสนักศึกษาที่ไม่ซ้ำกันได้');
      }

    } else {
      await prisma.candidateProfile.update({
        where: { id: req.user.profileId },
        data: dataToUpdate,
      });
    }

    const finalProfile = await prisma.candidateProfile.findUnique({
        where: { id: req.user.profileId },
        include: {
            skills: { include: { skill: true } },
            workHistory: { orderBy: { startDate: "desc" } },
            certificateFiles: true,
            contactFiles: true,
            interests: { include: { company: true } },
        }
    });

    res.status(200).json(finalProfile);

  } catch (error) {
    console.error("Error saving application details:", error);
    res.status(500).send("Server Error");
  }
});

export default router;