import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const router = express.Router();

//ตั้งค่าสำหรับส่งอีเมล (Nodemailer) ด้วย OAuth2
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        type: "OAuth2",
        user: process.env.OAUTH_SENDER_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    }
})

//@route   POST /api/interactions/interest/:studentId
router.post("/interest/:studentId", protect, authorize("COMPANY"), async(req,res) =>{
    try {
        const {studentId} = req.params;
        const {contactInstructions} = req.body;

        if(!contactInstructions){
            return res.status(400).json({message: "กรุณาระบุช่องทางการติดต่อกลับ"});
        }

        const companyProfile = await prisma.companyProfile.findUnique({where: {id: req.user.profileId}});
        const studentProfile = await prisma.candidateProfile.findUnique({where: {id: studentId}});

        if(!studentProfile){
            return res.status(404).json({message: "ไม่พบโปรไฟล์ของนักศึกษา"});
        }

        const newInteraction = await prisma.interaction.create({
            data: {
                contactInstructions,
                companyProfileId: companyProfile.id,
                studentProfileId: studentId,
            }
        })

        try {
        await transporter.sendMail({
          from: `"IdeaTrade Jobs" <${process.env.OAUTH_SENDER_EMAIL}>`,
          to: studentProfile.contactEmail,
          subject: `[IdeaTrade] บริษัท ${companyProfile.companyName} สนใจในโปรไฟล์ของคุณ`,
          text: contactInstructions, //ส่งเป็นข้อความธรรมดา
        });
        console.log(`Plain text email sent successfully to ${studentProfile.contactEmail}`);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
      
      res.status(201).json({
        message: "แสดงความสนใจและส่งการแจ้งเตือนเรียบร้อย",
        data: newInteraction,
      });

    } catch (error) {
      console.error("Error creating interaction:", error);
      res.status(500).send("Server Error");
    }
  });

//@route   GET /api/interactions/my-interests
router.get("/my-interests", protect, authorize("CANDIDATE"), async(req,res) =>{
    try{
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
            orderBy:{
                createdAt: "desc",
            }
        });

        res.json(interests);
        
    } catch (error){
        console.error("Error fetching interests:", error);
        res.status(500).send("Server Error");
    }
})

export default router;