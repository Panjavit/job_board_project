import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { protect, authorize } from '../middleware/auth.js';
import upload from "../middleware/upload.js";

const prisma = new PrismaClient();
const router = express.Router();

//@route   POST /api/contact-files  = Upload a new resume file
router.post("/",protect,authorize("CANDIDATE"), upload.single('file'), async(req,res) => {
     try {
        // 3. ข้อมูลไฟล์จะถูกเก็บใน req.file โดย multer
        if (!req.file) {
            return res.status(400).json({ message: 'กรุณาแนบไฟล์' });
        }

        const newFile = await prisma.contactFile.create({
            data: {
                name: req.file.originalname, // ชื่อไฟล์เดิม
                // สร้าง URL ที่ถูกต้องสำหรับเข้าถึงไฟล์
                url: `/uploads/${req.file.filename}`, 
                type: req.file.mimetype,
                candidateProfileId: req.user.profileId
            }
        });
        res.status(201).json(newFile);
    } catch (error) {
        console.error("Error creating contact file entry:", error);
        res.status(500).send("Server Error");
    }
});

//@route   DELETE /api/contact-files/:id
router.delete("/:id", protect, authorize("CANDIDATE"), async(req, res) => {
    try {
        const {id} = req.params;
        const file = await prisma.contactFile.findUnique({where: {id}});

        if (file?.candidateProfileId !== req.user.profileId) {
            return res.status(403).json({message: 'User not authorized to delete this file'});
        }

        await prisma.contactFile.delete({where: {id}});
        res.json({ message: "ลบไฟล์เรซูเม่เรียบร้อย" });
    } catch (error) {
        console.error("Error deleting contact file:", error);
        res.status(500).send("Server Error");
    }
});


export default router;