import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";
import nodemailer from "nodemailer";
import { Client } from "@line/bot-sdk";

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};
const lineClient = new Client(lineConfig);
const prisma = new PrismaClient();
const router = express.Router();

//ตั้งค่าสำหรับส่งอีเมล (Nodemailer) ด้วย OAuth2
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

//@route   POST /api/interactions/interest/:studentId
router.post("/interest/:studentId", protect, authorize("COMPANY"), async (req, res) => {
    try {
        const { studentId } = req.params;
        //ดึงข้อมูลบริษัทพร้อมข้อมูลติดต่อทั้งหมด
        const companyProfile = await prisma.companyProfile.findUnique({
            where: { id: req.user.profileId },
            include: {
                emails: { select: { email: true } },
                phones: { select: { phone: true } },
            }
        });

        const studentProfile = await prisma.candidateProfile.findUnique({
            where: { id: studentId },
        });

        if (!studentProfile || !companyProfile) {
            return res.status(404).json({ message: "ไม่พบโปรไฟล์" });
        }
        
        await prisma.interaction.create({
            data: {
                companyProfileId: companyProfile.id,
                studentProfileId: studentId,
            }
        });

        //สร้างเนื้อหาอีเมลจากข้อมูล Profile ที่ดึงมา
        const companyEmails = companyProfile.emails.map(e => `- ${e.email}`).join('\n');
        const companyPhones = companyProfile.phones.map(p => `- ${p.phone}`).join('\n');

        const emailText = `
เรียน คุณ ${studentProfile.fullName},

บริษัท ${companyProfile.companyName} ได้พิจารณาโปรไฟล์ของคุณและมีความสนใจเป็นอย่างยิ่ง

ทางบริษัทขอแจ้งข้อมูลสำหรับติดต่อกลับไว้ดังนี้:

---

**ข้อมูลติดต่อ:**

**ผู้รับผิดชอบ:**
${companyProfile.recruiterName || 'ฝ่ายบุคคล'} (${companyProfile.recruiterPosition || 'ไม่ระบุตำแหน่ง'})

**อีเมล:**
${companyEmails || 'ไม่ระบุ'}

**เบอร์โทรศัพท์:**
${companyPhones || 'ไม่ระบุ'}

**ช่องทางอื่นๆ:**
${companyProfile.additionalContactInfo || 'ไม่มี'}

---

หากท่านสนใจ กรุณาติดต่อกลับตามช่องทางที่สะดวก

ขอแสดงความนับถือ,
ทีมงานบริษัท ${companyProfile.companyName}
        `.trim();


        try {
            await transporter.sendMail({
                from: `"IdeaTrade Jobs" <${process.env.OAUTH_SENDER_EMAIL}>`,
                to: studentProfile.contactEmail,
                subject: `[IdeaTrade] การติดต่อจากบริษัท ${companyProfile.companyName}`,
                html: emailText.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'),
                text: emailText,
            });
            console.log(`Email sent successfully to ${studentProfile.contactEmail}`);
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
        }
      

        if (studentProfile.lineUserId) {
            try {
                const lineMessage = {
                    type: 'text',
                    text: `บริษัท ${companyProfile.companyName} สนใจในโปรไฟล์ของคุณ และได้ส่งรายละเอียดการติดต่อกลับให้ทางอีเมลแล้ว กรุณาตรวจสอบอีเมลของท่าน`
                };
                await lineClient.pushMessage(studentProfile.lineUserId, lineMessage);
                console.log(`LINE message sent successfully to ${studentProfile.lineUserId}`);
            } catch (lineError) {
                console.error("Failed to send LINE notification:", lineError.originalError?.response?.data || lineError.message);
            }
        }
      
        res.status(201).json({ message: "แสดงความสนใจและส่งการแจ้งเตือนเรียบร้อย" });

    } catch (error) {
        if (error.code === 'P2002') {
             return res.status(400).json({ message: "คุณเคยแสดงความสนใจนักศึกษาคนนี้ไปแล้ว" });
        }
        console.error("Error creating interaction:", error);
        res.status(500).send("Server Error");
    }
});

//@route   GET /api/interactions/my-interests
router.get(
  "/my-interests",
  protect,
  authorize("CANDIDATE"),
  async (req, res) => {
    try {
      const interests = await prisma.interaction.findMany({
        where: {
          studentProfileId: req.user.profileId,
        },
        include: {
          company: {
            select: {
              companyName: true,
              about: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json(interests);
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  }
);

export default router;
