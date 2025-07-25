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
      internshipType,
      page = 1,
      limit = 12,
      sort = "desc",
    } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause = [];

    whereClause.push({ desiredPosition: { not: null } });

    if (position) {
      whereClause.push({
        desiredPosition: {
          contains: position,
          mode: "insensitive",
        },
      });
    }

    if (skills) {
      const skillList = skills.split(",").map((skill) => skill.trim());
      whereClause.push({
        skills: {
          every: {
            skill: {
              name: {
                in: skillList,
                mode: "insensitive",
              },
            },
          },
        },
      });
    }

    if (studyYear) {
      const year = parseInt(studyYear, 10);
      if (!isNaN(year)) {
        whereClause.push({ studyYear: year });
      }
    }

    if (studentCode) {
      whereClause.push({
        studentCode: {
          equals: studentCode,
        },
      });
    }
    
    if (internshipType) {
      whereClause.push({ internshipType: internshipType });
    }

    let orderBy = {};
    if (sort === "asc") {
      orderBy = { createdAt: "asc" };
    } else {
      orderBy = { updatedAt: "desc" };
    }


    const students = await prisma.candidateProfile.findMany({
      where: { AND: whereClause },
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
        internshipType: true,
        startDate: true,
        endDate: true,
      },
      orderBy: orderBy,
    });

    const totalStudents = await prisma.candidateProfile.count({ where: { AND: whereClause } });

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
