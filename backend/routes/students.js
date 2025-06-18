import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, authorize } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/students
router.get('/', protect, authorize("COMPANY"), async (req, res) => {
    try {
        const { position, skills, page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // สร้างเงื่อนไข 
        const where = {};

        if (position) {
            where.desiredPosition = {
                contains: position,
                mode: "insensitive",
            }
        }

        if (skills) {
            const skillList = skills.split(',').map(skill => skill.trim());
            where.skills = {
                every: {
                    skill: {
                        name: {
                            in: skillList,
                            mode: "insensitive",
                        }
                    }
                }
            }
        }

        const students = await prisma.candidateProfile.findMany({
            where,
            skip,
            take: limitNum,
            include: {
                skills: {
                    orderBy: { rating: 'desc' },
                    include: {
                        skill: true,
                    }
                }
            },
            orderBy: {
                updatedAt: "desc",
            }
        })

        const totalStudents = await prisma.candidateProfile.count({ where });

        res.json({
            data: students,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalStudents / limitNum),
                totalItems: totalStudents,
            }
        })

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
                    orderBy: { rating: 'desc' },
                    include: {
                        skill: true,
                    }
                }
            }
        })
        
        if (!studentProfile) {
            return res.status(404).json({ message: "ไม่พบโปรไฟล์ของนักศึกษา" })
        }

        res.json(studentProfile);
    } catch (error) {
        console.error(`Error fetching student profile with id: ${req.params.id}`, error);
        res.status(500).send("Server Error");
    }
});

export default router;