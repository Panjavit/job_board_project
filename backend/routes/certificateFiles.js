import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// @route   POST /api/certificate-files
// @desc    Upload a new certificate file with description
// @access  Private (CANDIDATE)
router.post("/", protect, authorize("CANDIDATE"), async (req, res) => {
    // ในแอปจริง ส่วนนี้ต้องใช้ middleware (เช่น multer) เพื่อรับไฟล์
    // นี่เป็นโค้ดตัวอย่างเพื่อแสดง Logic เท่านั้น
    const { description, fileName, fileUrl, fileType } = req.body; 

    if (!fileName || !fileUrl || !fileType) {
        return res.status(400).json({ message: 'Missing file data.' });
    }

    try {
        const newFile = await prisma.certificateFile.create({
            data: {
                name: fileName,
                url: fileUrl, // URL ที่ได้จากการอัปโหลดไฟล์ไปที่ Cloud Storage
                type: fileType,
                description: description,
                candidateProfileId: req.user.profileId
            }
        });
        res.status(201).json(newFile);
    } catch (error) {
        console.error("Error creating certificate file entry:", error);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE /api/certificate-files/:id
// @desc    Delete a certificate file
// @access  Private (CANDIDATE)
router.delete("/:id", protect, authorize("CANDIDATE"), async (req, res) => {
    try {
        const { id } = req.params;
        // ต้องตรวจสอบว่าเป็นเจ้าของไฟล์จริงหรือไม่
        const file = await prisma.certificateFile.findUnique({ where: { id } });
        if (file?.candidateProfileId !== req.user.profileId) {
            return res.status(403).json({ message: 'User not authorized to delete this file' });
        }
        
        await prisma.certificateFile.delete({ where: { id } });
        // ควรมี Logic ลบไฟล์ออกจาก Cloud Storage ด้วย
        res.json({ message: "ลบไฟล์เรียบร้อย" });
    } catch (error) {
        console.error("Error deleting certificate file:", error);
        res.status(500).send("Server Error");
    }
});

export default router;