import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/students
router.get("/", async (req, res) => {
  try {
    const {
      position,
      skills,
      studyYear,
      studentCode,
      page = 1,
      limit = 10,
      sort = "desc",
    } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      // ค้นหาเฉพาะ CandidateProfile ที่มี InternshipApplication อย่างน้อย 1 รายการ
      internshipApplications: {
        some: {}, // ใส่ object ว่างๆ ใน some หมายถึง "ขอแค่มีอย่างน้อยหนึ่งรายการ"
      },
    };

    if (position) {
      where.desiredPosition = {
        contains: position,
        mode: "insensitive",
      };
    }

    if (skills) {
      const skillList = skills.split(",").map((skill) => skill.trim());
      where.skills = {
        every: {
          skill: {
            name: {
              in: skillList,
              mode: "insensitive",
            },
          },
        },
      };
    }

    if (studyYear) {
      const year = parseInt(studyYear, 10);
      if (!isNaN(year)) {
        where.studyYear = year;
      }
    }

    if (studentCode) {
      where.studentCode = {
        equals: studentCode,
      };
    }

    // สร้างเงื่อนไขการเรียงลำดับ
    let orderBy = {};
    if (sort === "asc") {
      orderBy = { createdAt: "asc" };
    } else {
      orderBy = { updatedAt: "desc" };
    }

    const students = await prisma.candidateProfile.findMany({
      where,
      skip,
      take: limitNum,
      select: {
        id: true,
        studentCode: true,
        fullName: true,
        desiredPosition: true,
        education: true,
        studyYear: true,
        major: true,
        updatedAt: true,
        profileImageUrl: true,
        skills: {
          select: {
            skill: {
              select: {
                name: true,
              },
            },
          },
        },
        internshipApplications: {
          select: {
            internshipType: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      // ✅ แก้ไขให้ใช้ตัวแปร orderBy ที่เราสร้างขึ้น
      orderBy: orderBy,
    });

    const totalStudents = await prisma.candidateProfile.count({ where });

    res.json({
      data: students,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalStudents / limitNum),
        totalItems: totalStudents,
      },
    });
  } catch (error) {
    console.error("Error fetching student profiles:", error);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/students/:id
router.get("/:id", protect, authorize("COMPANY"), async (req, res) => {
  try {
    const { id } = req.params;
    const studentProfile = await prisma.candidateProfile.findUnique({
      where: { id },
      include: {
        skills: {
          orderBy: { rating: "desc" },
          include: {
            skill: true,
          },
        },
        workHistory: {
          orderBy: {
            startDate: "desc",
          },
        },
        certificateFiles: true,
        contactFiles: true,
        internshipApplications: true,
      },
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "ไม่พบโปรไฟล์ของนักศึกษา" });
    }

    const interaction = await prisma.interaction.findFirst({
      where: {
        companyProfileId: req.user.profileId,
        studentProfileId: id,
      },
    });

    const isInterestedByCompany = !!interaction;

    res.json({ ...studentProfile, isInterestedByCompany });
  } catch (error) {
    console.error(
      `Error fetching student profile with id: ${req.params.id}`,
      error
    );
    res.status(500).send("Server Error");
  }
});

export default router;
