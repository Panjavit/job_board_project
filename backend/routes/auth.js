import express from 'express'; //สำหรับการสร้าง Router
import bcrypt from 'bcryptjs'; //เข้ารหัสรหัสผ่าน
import { PrismaClient } from '@prisma/client'; //ใช้เพื่อเชื่อมต่อและส่งคำสั่งไปยังฐานข้อมูล PostgreSQL
import jwt from 'jsonwebtoken';
import { protect, authorize } from '../middleware/auth.js'; //
import { OAuth2Client } from 'google-auth-library';

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
router.post('/google', async (req,res) =>{
    try {
        const {code} = req.body; //รับ Authorization code จาก frontend
        if(!code){
            return res.status(400).json({message: 'Authorization code is missing'});
        }
        const {token} = await client.getToken(code);
        const idToken = token.id_token;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const googlePayload = ticket.getPayload();

        const {
            sub: googleId,
            email,
            name,
        } = googlePayload;

        //ค้นหาผู้ใช้ในระบบของเรา หรือสร้างใหม่ถ้ายังไม่มี
        const user = await prisma.user.upsert({
            where: {socialId: googleId},
            update: {},
            create: {
                email,
                socialId: googleId,
                role: 'CANDIDATE', //สมมติว่าคนที่ล็อกอินด้วย Google เป็น Candidate เสมอ ค่อยมาปรับแก้ทีหลัง
                candidateProfile: {
                    create: {
                        fullName: name,
                        contactEmail: email
                    }
                }
            },
            include: {
                candidateProfile: {select: {id:true}},
                companyProfile: {select: {id:true}},
            }
        })
        //สร้าง JWT Token ของแอปเพื่อส่งกลับไปให้ Frontend
        const profileId = user.candidateProfile?.id || user.companyProfile?.id;
        const appPayload = {
            user: {
                id: user.id,
                profileId: profileId,
                role: user.role,
                name: user.candidateProfile?.fullName,
            }
        }

        jwt.sign(
            appPayload,
            process.env.JWT_SECRET,
            {expiresIn: '1d'},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        )
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({message: 'Google authentication failed'});
    }
})


// (ใส่ Route สำหรับ Login และ Social Login ต่อไป)
export default router;










//======
// //API สำหรับรับ Code และตรวจสอบผู้ใช้ ---
// //@route   POST /api/auth/google/callback
// router.post('/google/callback', async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) {
//       return res.status(400).json({ message: 'Authorization code is missing' });
//     }

//     const client =  new OAuth2Client(
//         process.env.GOOGLE_CLIENT_ID,
//         process.env.GOOGLE_CLIENT_SECRET,
//         'postmessage'
//     )

//     const { tokens } = await client.getToken(code);
//     const idToken = tokens.id_token;
    
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const googlePayload = ticket.getPayload();
//     const { sub: googleId, email, name } = googlePayload;

//     // ค้นหาผู้ใช้ในระบบ
//     const existingUser = await prisma.user.findUnique({
//       where: { socialId: googleId },
//       include: { candidateProfile: true, companyProfile: true },
//     });

//     // ถ้าเป็นผู้ใช้เก่า: ล็อกอินได้เลย
//     if (existingUser) {
//       const profileId = existingUser.candidateProfile?.id || existingUser.companyProfile?.id;
//       const appPayload = { user: { id: existingUser.id, profileId, role: existingUser.role } };
//       const token = jwt.sign(appPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
//       return res.json({ token, isNewUser: false });
//     }

//     // ถ้าเป็นผู้ใช้ใหม่: ส่งข้อมูลกลับไปให้ Frontend เพื่อเลือก Role
//     res.json({
//       isNewUser: true,
//       googleProfile: { googleId, email, name }
//     });

//   } catch (error) {
//     console.error('Google Auth Callback Error:', error);
//     res.status(400).json({ message: 'Google authentication failed' });
//   }
// });

// //API สำหรับสร้างบัญชีใหม่หลังเลือก Role ---
// //@route   POST /api/auth/google/register
// router.post('/google/register', async (req, res) => {
//   try {
//     const { googleProfile, role } = req.body;
//     const { googleId, email, name } = googleProfile;

//     if (!googleProfile || !role || !['CANDIDATE', 'COMPANY'].includes(role)) {
//       return res.status(400).json({ message: 'Invalid registration data' });
//     }

//     // ตรวจสอบอีกครั้งว่ายังไม่มีผู้ใช้นี้อยู่จริงๆ
//     const existingUser = await prisma.user.findFirst({
//         where: { OR: [{ email }, { socialId: googleId }] }
//     });

//     if (existingUser) {
//         return res.status(400).json({ message: 'User already exists.' });
//     }
    
//     // สร้าง User และ Profile ตาม Role ที่เลือก
//     const user = await prisma.user.create({
//       data: {
//         email,
//         socialId: googleId,
//         authProvider: 'google',
//         role: role,
//         candidateProfile: role === 'CANDIDATE' ? {
//           create: { fullName: name, contactEmail: email },
//         } : undefined,
//         companyProfile: role === 'COMPANY' ? {
//           create: { companyName: name, contactInstructions: `ติดต่อผ่าน ${email}` },
//         } : undefined,
//       },
//       include: { candidateProfile: true, companyProfile: true },
//     });

//     // สร้าง JWT Token แล้วส่งกลับไป
//     const profileId = user.candidateProfile?.id || user.companyProfile?.id;
//     const appPayload = { user: { id: user.id, profileId, role: user.role } };
//     const token = jwt.sign(appPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.status(201).json({ token });

//   } catch (error) {
//     console.error('Google Registration Error:', error);
//     res.status(500).json({ message: 'Failed to create user account' });
//   }
// });
