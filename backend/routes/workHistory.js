import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

//@route   POST /api/work-history = Add a new work history entry
router.post("/", protect, authorize("CANDIDATE"), async (req, res) => {
    try {
        const { companyName, position, startDate, endDate, description } = req.body;
        const newWorkHistory = await prisma.workHistory.create({
            data: {
                candidateProfileId: req.user.profileId,
                companyName,
                position,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description,
            },
        });
        res.status(201).json(newWorkHistory);
    } catch (error) {
        console.error("Error adding work history:", error);
        res.status(500).send("Server Error");
    }
});

//@route   PUT /api/work-history/:id = Update a work history entry
router.put("/:id", protect, authorize("CANDIDATE"), async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, position, startDate, endDate, description } = req.body;
        const updatedWorkHistory = await prisma.workHistory.update({
            where: { id },
            data: {
                companyName,
                position,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description,
            },
        });
        res.json(updatedWorkHistory);
    } catch (error) {
        console.error("Error updating work history:", error);
        res.status(500).send("Server Error");
    }
});

//@route   DELETE /api/work-history/:id
router.delete("/:id", protect, authorize("CANDIDATE"), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.workHistory.delete({
            where: { id },
        });

        res.json({ message: "ลบประวัติการทำงานเรียบร้อย" });
    } catch (error) {
        console.error("Error deleting work history:", error);
        res.status(500).send("Server Error");
    }
});

export default router;