import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // **ข้อควรระวัง** ฟอร์มสาธารณะไม่ควรอนุญาตให้สมัครเป็น 'admin'
        if (role === 'admin') {
            return res.status(403).json({ message: 'ไม่สามารถลงทะเบียนเป็น Admin ได้' });
        }
        
        // ตรวจสอบข้อมูลซ้ำ
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prisma จะสร้าง User และ Profile ที่เชื่อมกันใน Transaction เดียว (Nested Write)
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role.toUpperCase(), // 'CANDIDATE' or 'COMPANY'
                // สร้าง Profile ที่เชื่อมกันไปพร้อมๆ กัน
                candidateProfile: role === 'candidate' ? {
                    create: { fullName: name, contactEmail: email }
                } : undefined,
                companyProfile: role === 'company' ? {
                    create: { companyName: name, contactInstructions: `ติดต่อผ่าน ${email}` }
                } : undefined,
            }
        });

        res.status(201).json({ message: 'ลงทะเบียนสำเร็จ!' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// (ใส่ Route สำหรับ Login และ Social Login ต่อไป)
export default router;