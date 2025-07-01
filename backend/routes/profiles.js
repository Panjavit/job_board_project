import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js"

const prisma = new PrismaClient();
const router = express.Router();

//@route   GET /api/profiles/candidate/me (Get current logged-in candidate's profile)
router.get(
  "/candidate/me",
  protect,
  authorize("CANDIDATE"),
  async (req, res) => {
    try {
      const profile = await prisma.candidateProfile.findUnique({
        where: { id: req.user.profileId },
        include: {
          skills: {
            //ดึงข้อมูล skill ทั้งหมดทีผูกกับโปรไฟล์นี้
            include: {
              skill: true, //เอาชื่อ Skill มาด้วย
            },
          },
          workHistory: {
            orderBy: {
              startDate: "desc",
            },
          },
          certificateFiles: true,
          contactFiles: true,
          internshipApplications: true,
        },
      });

      if (!profile) {
        return res.status(404).json({ message: "ไม่พบโปรไฟล์ของผู้สมัคร" });
      }

      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//@route   PATCH /api/profiles/candidate/me/personal-info  อัปเดตข้อมูลส่วนตัวพื้นฐานของนักศึกษา
router.patch(
  "/candidate/me/personal-info",
  protect,
  authorize("CANDIDATE"),
  async (req, res) => {
    try {
      //รับข้อมูลทั้งหมดจาก req.body รวมถึงฟิลด์ใหม่
      const dataToUpdate = {};
      const {
        fullName,
        contactEmail,
        major,
        studyYear,
        bio,
        nickname,
        gender,
        dateOfBirth,
        phoneNumber,
        education,
        videoUrl,
        videoDescription,
      } = req.body;

      // ตรวจสอบแต่ละฟิลด์ ถ้ามีค่าส่งมาถึงจะเพิ่มเข้าไปใน object ที่จะใช้อัปเดต
      if (fullName !== undefined) dataToUpdate.fullName = fullName;
      if (contactEmail !== undefined) dataToUpdate.contactEmail = contactEmail;
      if (major !== undefined) dataToUpdate.major = major;
      if (studyYear !== undefined) dataToUpdate.studyYear = studyYear ? parseInt(studyYear, 10) : null;
      if (bio !== undefined) dataToUpdate.bio = bio;
      if (nickname !== undefined) dataToUpdate.nickname = nickname;
      if (gender !== undefined) dataToUpdate.gender = gender;
      if (dateOfBirth !== undefined) dataToUpdate.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
      if (phoneNumber !== undefined) dataToUpdate.phoneNumber = phoneNumber;
      if (education !== undefined) dataToUpdate.education = education;
      if (videoUrl !== undefined) dataToUpdate.videoUrl = videoUrl;
      if (videoDescription !== undefined) dataToUpdate.videoDescription = videoDescription;

      // ใช้ dataToUpdate ที่สร้างขึ้นมาใหม่ในการอัปเดต
      const updatedProfile = await prisma.candidateProfile.update({
        where: { id: req.user.profileId },
        data: dataToUpdate,
      });

      //ส่งข้อมูลที่อัปเดตแล้วกลับไป
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating personal info:", error);
      res.status(500).send("Server Error");
    }
  }
);

//@route   PUT /api/profiles/candidate/me/skills อัปเดตรายการทักษะทั้งหมดของนักศึกษา (ลบของเก่าและสร้างใหม่)
router.put(
  "/candidate/me/skills",
  protect,
  authorize("CANDIDATE"),
  async (req, res) => {
    const { skills } = req.body; // รับแค่ skills

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    try {
      await prisma.$transaction(async (tx) => {
        //ล้าง Skill เก่าทั้งหมดของ user คนนี้ทิ้งก่อน
        await tx.userSkill.deleteMany({
          where: { candidateProfileId: req.user.profileId },
        });

        //เพิ่ม Skill ที่ส่งมาใหม่ทั้งหมด
        for (const userSkill of skills) {
          //สมมติว่า skills คือ [{name: 'React', rating: 5}]
          //ตรวจสอบว่ามีชื่อ skill ส่งมาจริง
          if (userSkill && userSkill.name) {
            const skillRecord = await tx.skill.upsert({
              where: { name: userSkill.name },
              update: {},
              create: { name: userSkill.name },
            });

            await tx.userSkill.create({
              data: {
                candidateProfileId: req.user.profileId,
                skillId: skillRecord.id,
                rating: parseInt(userSkill.rating, 10) || 1, // ใส่ค่า rating เริ่มต้นหากไม่มี
              },
            });
          }
        }
      });

      //ดึงข้อมูลโปรไฟล์ล่าสุดพร้อม Skill ทั้งหมดเพื่อส่งกลับไป
      const finalProfile = await prisma.candidateProfile.findUnique({
        where: { id: req.user.profileId },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
           workHistory: {
            orderBy: {
              startDate: "desc",
            },
          },
          certificateFiles: true,
          contactFiles: true,
          internshipApplications: true,
        },
      });
      res.json(finalProfile);
    } catch (error) {
      console.error("Error updating skills:", error);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/profiles/company/me (Get current logged-in company's profile)
router.get("/company/me", protect, authorize("COMPANY"), async (req, res) => {
  console.log(
    ` Handler for GET /api/profiles/company/me was matched! User ID: ${req.user.id} ---`
  );
  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { id: req.user.profileId },
    });
    if (!profile) {
      return res.status(404).json({ message: "ไม่พบโปรไฟล์บริษัท" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error in GET /company/me:", error);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/profiles/company/me (Update current logged-in company's profile)
router.put("/company/me", protect, authorize("COMPANY"), async (req, res) => {
  try {
    const { companyName, about, contactInstructions } = req.body;
    const updateProfile = await prisma.companyProfile.update({
      where: { id: req.user.profileId },
      data: {
        companyName: companyName,
        about: about,
        contactInstructions: contactInstructions,
      },
    });
    res.json(updateProfile);
  } catch (error) {
    console.error("Error in PUT /company/me:", error);
    res.status(500).send("Server Error");
  }
});

//@route  POST /api/profiles/candidate/me/avatar = Upload or update candidate profile picture
router.post(
  "/candidate/me/avatar",
  protect,
  authorize("CANDIDATE"),
  upload.single("file"), 
  async (req, res) => {
    try {
      //ตรวจสอบว่ามีไฟล์ถูกอัปโหลดมาหรือไม่
      if (!req.file) {
        return res.status(400).json({ message: "กรุณาแนบไฟล์รูปภาพ" });
      }

      //สร้าง URL สำหรับเข้าถึงไฟล์ที่อัปโหลด
      const imageUrl = `/uploads/${req.file.filename}`;

      //อัปเดต path ของรูปภาพลงในฐานข้อมูล
      const updatedProfile = await prisma.candidateProfile.update({
        where: { id: req.user.profileId },
        data: {
          profileImageUrl: imageUrl,
        },
      });

      res.json({
        message: "อัปโหลดรูปโปรไฟล์สำเร็จ",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
