import express from 'express'; //สำหรับการสร้าง Router
import bcrypt from 'bcryptjs'; //เข้ารหัสรหัสผ่าน
import { PrismaClient } from '@prisma/client'; //ใช้เพื่อเชื่อมต่อและส่งคำสั่งไปยังฐานข้อมูล PostgreSQL
import jwt from 'jsonwebtoken';
import { protect, authorize } from '../middleware/auth.js'; //

const prisma = new PrismaClient();
const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', async (req, res) => { //req (Request),res (Response)  ใช้ async เพราะต้องมีการรอผลลัพธ์
    try {
        const { name, email, password, role } = req.body;

        // **ข้อควรระวัง** ฟอร์มสาธารณะไม่ควรอนุญาตให้สมัครเป็น 'admin'
        if (role === 'admin') { //Never Trust the Client
            return res.status(403).json({ message: 'ไม่สามารถลงทะเบียนเป็น Admin ได้' });
        }
        
        // ตรวจสอบข้อมูลซ้ำ
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10); //ไม่เก็บรหัสผ่านจริง

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

// @route   POST /api/auth/login
router.post('/login', async (req, res) =>{
    try {
        const {email,password} = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user || !user.password){
            return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'})
        }

        //สร้างข้อมูลสำหรับ Token
        const payload = {
            user: {
                id: user.id,
                profileId: user.profileId,
                role: user.role
            }
        };

        //สร้างและส่ง Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d'},
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/me
router.get('/me', protect, async(req, res) =>{
    res.status(200).json({
        success: true,
        data: req.user
    })
})

// (ใส่ Route สำหรับ Login และ Social Login ต่อไป)
export default router;