import express from 'express'; //สำหรับการสร้าง Router
import bcrypt from 'bcryptjs'; //เข้ารหัสรหัสผ่าน
import { PrismaClient } from '@prisma/client'; //ใช้เพื่อเชื่อมต่อและส่งคำสั่งไปยังฐานข้อมูล PostgreSQL
import jwt from 'jsonwebtoken';
import { protect, authorize } from '../middleware/auth.js'; //
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const router = express.Router();
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage', 
);

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
                candidateProfile: role.toLowerCase() === 'candidate' ? {
                    create: { fullName: name, contactEmail: email }
                } : undefined,
                companyProfile: role.toLowerCase() === 'company' ? {
                    create: { companyName: name, contactInstructions: `ติดต่อผ่าน ${email}` }
                } : undefined,
            },
            include: {
                candidateProfile: true,
                companyProfile: true
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
            where: { email },
            include: {
                candidateProfile: { select: { id: true, fullName: true } },
                companyProfile: { select: { id: true, companyName: true } }   // สั่งให้ดึงข้อมูล companyProfile มาด้วย
            }
        });
        if (!user || !user.password){
            return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'})
        }

        const profileId = user.candidateProfile?.id || user.companyProfile?.id;
        const displayName = user.candidateProfile?.fullName || user.companyProfile?.companyName;

        //สร้างข้อมูลสำหรับ Token
        const payload = {
            user: {
                id: user.id,
                profileId: profileId,
                role: user.role,
                name: displayName
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

// @route   POST /api/auth/google  จัดการการล็อกอินด้วย Google
router.post('/google', async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Authorization code is missing.' });
    }

    try {
        const oauth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        );

        // --- ส่วนที่แก้ไข ---
        // 1. รับการตอบกลับทั้งหมดจาก Google มาเก็บในตัวแปร response
        const response = await oauth2Client.getToken(code);

        // 2. ดึง id_token ออกมาอย่างปลอดภัย และตรวจสอบว่ามีค่าจริง
        const id_token = response.tokens.id_token;
        if (!id_token) {
            console.error('Google Auth Error: id_token not found in response', response);
            return res.status(400).json({ message: 'ไม่สามารถดึงข้อมูล id_token จาก Google ได้' });
        }
        // --- จบส่วนที่แก้ไข ---

        const ticket = await oauth2Client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            return res.status(400).json({ message: 'ข้อมูลที่ได้จาก Google ไม่สมบูรณ์' });
        }

        const { email: googleEmail, name: googleName, picture: googlePictureUrl } = payload;

        // ค้นหาหรือสร้างผู้ใช้ในระบบ
        const user = await prisma.user.upsert({
            where: { email: googleEmail },
            update: {
                authProvider: 'google',
                socialId: payload.sub,
            },
            create: {
                email: googleEmail,
                role: 'CANDIDATE',
                authProvider: 'google',
                socialId: payload.sub,
                candidateProfile: {
                    create: {
                        fullName: googleName,
                        contactEmail: googleEmail,
                        //profileImageUrl: googlePictureUrl,
                    },
                },
            },
            include: {
                candidateProfile: true,
                companyProfile: true,
            },
        });

        const profileId = user.candidateProfile?.id || user.companyProfile?.id;

        const token = jwt.sign(
            {
                user: {
                    id: user.id,
                    role: user.role,
                    profileId: profileId,
                    name: user.candidateProfile?.fullName || user.companyProfile?.companyName,
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยืนยันตัวตนกับ Google' });
    }
});

// @route   POST /api/auth/line/callback
// @desc    จัดการ Callback จาก LINE Login และสร้าง/ล็อกอินผู้ใช้
router.post('/line/callback', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code is missing' });
    }

    try {
        const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.LINE_REDIRECT_URI, // ต้องตรงกับที่ตั้งค่าใน LINE Console
            client_id: process.env.LINE_CHANNEL_ID,
            client_secret: process.env.LINE_CHANNEL_SECRET,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { id_token } = tokenResponse.data;

        
        const decodedProfile = jwt.decode(id_token);
        const { 
            sub: lineUserId, //'sub' คือ LINE User ID
            name: lineName, 
            picture: linePictureUrl,
            email: lineEmail
        } = decodedProfile;

        if (!lineUserId) {
            return res.status(400).json({ message: 'Failed to get user ID from LINE' });
        }


        const user = await prisma.user.upsert({
            where: { email: lineEmail },
            update: {
                authProvider: 'line',
                socialId: lineUserId,
                lineUserId: lineUserId, 
            },
            create: {
                email: lineEmail,
                role: 'CANDIDATE',
                authProvider: 'line',
                socialId: lineUserId,
                lineUserId: lineUserId, 
                candidateProfile: {
                    create: {
                        fullName: lineName,
                        contactEmail: lineEmail,
                        lineUserId: lineUserId, 
                    },
                },
            },
            include: {
                candidateProfile: true,
                companyProfile: true,
            },
        });

        const profileId = user.candidateProfile?.id || user.companyProfile?.id;
        const displayName = user.candidateProfile?.fullName || user.companyProfile?.companyName;

        const appPayload = {
            user: {
                id: user.id,
                profileId: profileId,
                role: user.role,
                name: displayName,
            }
        };

        jwt.sign(
            appPayload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); //ส่ง Token ของแอปเรากลับไปให้ Frontend
            }
        );

    } catch (error) {
        console.error('LINE Login Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'LINE authentication failed' });
    }
});

// @route   POST /api/auth/change-password
// @desc    เปลี่ยนรหัสผ่านสำหรับผู้ใช้ที่ล็อกอินอยู่
// @access  Private
router.post('/change-password', protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        //ดึงข้อมูลผู้ใช้จากฐานข้อมูล (รวมรหัสผ่านปัจจุบัน)
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user || !user.password) {
            return res.status(401).json({ message: 'ไม่พบผู้ใช้หรือผู้ใช้นี้ไม่มีรหัสผ่าน' });
        }

        //ตรวจสอบว่ารหัสผ่านเดิมที่กรอกมาถูกต้องหรือไม่
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
        }

        //เข้ารหัสรหัสผ่านใหม่และบันทึก
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedNewPassword },
        });

        res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


//@route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        //ไม่แจ้ง error ออกไป หากไม่พบผู้ใช้ในระบบ เพื่อป้องกันการเดาสุ่มอีเมล
        if (!user) {
            return res.json({ message: 'หากอีเมลนี้มีอยู่ในระบบ คุณจะได้รับลิงก์สำหรับรีเซ็ตรหัสผ่าน' });
        }

        //สร้าง Token สำหรับรีเซ็ต
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        //กำหนดเวลาหมดอายุ
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        //บันทึก Token ที่เข้ารหัสแล้วและเวลาหมดอายุลง DB
        await prisma.user.update({
            where: { email },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });

        //สร้าง URL สำหรับให้ผู้ใช้คลิก
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `
            <h1>คุณได้ส่งคำขอรีเซ็ตรหัสผ่าน</h1>
            <p>กรุณาคลิกที่ลิงก์ด้านล่างเพื่อตั้งรหัสผ่านใหม่ ลิงก์นี้จะหมดอายุใน 10 นาที</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        `;

        //ส่งอีเมล (ใช้ transporter ที่มีอยู่แล้ว)
         const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: process.env.OAUTH_SENDER_EMAIL,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            },
        });

        await transporter.sendMail({
            from: `"IdeaTrade Jobs" <${process.env.OAUTH_SENDER_EMAIL}>`,
            to: user.email,
            subject: 'คำขอรีเซ็ตรหัสผ่าน',
            html: message,
        });

        res.json({ message: 'ลิงก์สำหรับรีเซ็ตรหัสผ่านได้ถูกส่งไปยังอีเมลของคุณแล้ว' });

    } catch (error) {
        console.error(error); 
        res.status(200).json({ message: 'หากอีเมลนี้มีอยู่ในระบบ คุณจะได้รับลิงก์สำหรับรีเซ็ตรหัสผ่าน' });
    }
});


//@route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    try {
        //เข้ารหัส token ที่ได้รับจาก URL เพื่อนำไปเปรียบเทียบกับใน DB
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        //ค้นหาผู้ใช้ด้วย token และต้องยังไม่หมดอายุ
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken,
                passwordResetExpires: {
                    gt: new Date(), //gt = Greater Than(มากกว่าเวลาปัจจุบัน)
                },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว' });
        }

        //เข้ารหัสรหัสผ่านใหม่ และอัปเดตลง DB
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                //ล้างค่า token ทิ้ง เพื่อไม่ให้ใช้ซ้ำได้
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

export default router;
