import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

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
          interests: {
            include: {
              company: {
                select: {
                  id: true,
                  companyName: true,
                  logoUrl: true,
                  businessTypeName: true,
                  province: true,
                  registeredCapital: true,
                  workArrangement: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
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
        portfolioUrl,
      } = req.body;

      // ตรวจสอบแต่ละฟิลด์ ถ้ามีค่าส่งมาถึงจะเพิ่มเข้าไปใน object ที่จะใช้อัปเดต
      if (fullName !== undefined) dataToUpdate.fullName = fullName;
      if (contactEmail !== undefined) dataToUpdate.contactEmail = contactEmail;
      if (major !== undefined) dataToUpdate.major = major;
      if (studyYear !== undefined)
        dataToUpdate.studyYear = studyYear ? parseInt(studyYear, 10) : null;
      if (bio !== undefined) dataToUpdate.bio = bio;
      if (nickname !== undefined) dataToUpdate.nickname = nickname;
      if (gender !== undefined) dataToUpdate.gender = gender;
      if (dateOfBirth !== undefined)
        dataToUpdate.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
      if (phoneNumber !== undefined) dataToUpdate.phoneNumber = phoneNumber;
      if (education !== undefined) dataToUpdate.education = education;
      if (videoUrl !== undefined) dataToUpdate.videoUrl = videoUrl;
      if (videoDescription !== undefined)
        dataToUpdate.videoDescription = videoDescription;
      if (portfolioUrl !== undefined) {
        dataToUpdate.portfolioUrl = portfolioUrl;
      }

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

    //ตรวจสอบข้อมูลเบื้องต้น
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
        },
      });
      res.json(finalProfile);
    } catch (error) {
      console.error("Error updating skills:", error);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/company/me/logo",
  protect,
  authorize("COMPANY"),
  upload.single("file"), // ใช้ multer middleware รับไฟล์เดียวชื่อ 'file'
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "กรุณาแนบไฟล์รูปภาพ" });
      }

      const logoUrl = `/uploads/${req.file.filename}`;

      const updatedProfile = await prisma.companyProfile.update({
        where: { id: req.user.profileId },
        data: { logoUrl: logoUrl },
      });

      res.json({
        message: "อัปโหลดโลโก้สำเร็จ",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error uploading company logo:", error);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/profiles/company/me (Get current logged-in company's profile)
router.get("/company/me", protect, authorize("COMPANY"), async (req, res) => {
  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { id: req.user.profileId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        emails: true,
        phones: true,
      },
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
    const dataToUpdate = {};
    const {
      companyName, about, location, recruiterName, recruiterPosition,
      additionalContactInfo, province, registrationNumber, legalName,
      companyType, businessTypeName, registeredCapital, totalRevenue, videoUrl,
      workArrangement, workingDays, workingHours, workPolicy
    } = req.body;
    if (companyName !== undefined) dataToUpdate.companyName = companyName;
    if (about !== undefined) dataToUpdate.about = about;
    if (location !== undefined) dataToUpdate.location = location;
    if (recruiterName !== undefined) dataToUpdate.recruiterName = recruiterName;
    if (recruiterPosition !== undefined) dataToUpdate.recruiterPosition = recruiterPosition;
    if (additionalContactInfo !== undefined) dataToUpdate.additionalContactInfo = additionalContactInfo;
    if (province !== undefined) dataToUpdate.province = province;
    if (registrationNumber !== undefined) dataToUpdate.registrationNumber = registrationNumber;
    if (legalName !== undefined) dataToUpdate.legalName = legalName;
    if (companyType !== undefined) dataToUpdate.companyType = companyType;
    if (businessTypeName !== undefined) dataToUpdate.businessTypeName = businessTypeName;
    if (videoUrl !== undefined) dataToUpdate.videoUrl = videoUrl;
    if (workArrangement !== undefined) dataToUpdate.workArrangement = workArrangement;
    if (workingDays !== undefined) dataToUpdate.workingDays = workingDays;
    if (workingHours !== undefined) dataToUpdate.workingHours = workingHours;
    if (workPolicy !== undefined) dataToUpdate.workPolicy = workPolicy;

    if (registeredCapital !== undefined) {
      dataToUpdate.registeredCapital = registeredCapital ? parseFloat(registeredCapital) : null;
    }
    if (totalRevenue !== undefined) {
      dataToUpdate.totalRevenue = totalRevenue ? parseFloat(totalRevenue) : null;
    }

    const updatedProfile = await prisma.companyProfile.update({
      where: { id: req.user.profileId },
      data: dataToUpdate,
    });

    res.json(updatedProfile);
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

// @route   GET /api/profiles/company/me/interested-students
// @desc    ดึงรายชื่อนักศึกษาทั้งหมดที่บริษัทนี้สนใจ
// @access  Private (COMPANY)
router.get(
  "/company/me/interested-students",
  protect,
  authorize("COMPANY"),
  async (req, res) => {
    try {
      //ค้นหา "Interaction" ทั้งหมดที่ตรงกับ ID ของบริษัทที่ล็อกอินอยู่
      const interactions = await prisma.interaction.findMany({
        where: {
          companyProfileId: req.user.profileId,
        },
        orderBy: {
          createdAt: "desc", // เรียงจากล่าสุดไปเก่าสุด
        },
        //สั่งให้ดึงข้อมูลของ "student" ที่เชื่อมกับ Interaction นั้นๆ มาด้วย
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              desiredPosition: true,
              major: true,
              profileImageUrl: true,
              universityName: true,
            },
          },
        },
      });
      //ส่งข้อมูลที่ได้กลับไปให้ Frontend
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching interested students:", error);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/profiles/company/:id
router.get("/company/:id", async (req, res) => {
  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { id: req.params.id },
      select: {
        companyName: true,
        about: true,
        location: true,
        logoUrl: true,
        recruiterName: true,
        recruiterPosition: true,
        additionalContactInfo: true,
        province: true,
        registrationNumber: true,
        legalName: true,
        companyType: true,
        businessTypeName: true,
        registeredCapital: true,
        videoUrl: true,
        workArrangement: true,
        workingDays: true, 
        workingHours: true, 
        workPolicy: true, 
        emails: { select: { email: true } },
        phones: { select: { phone: true } },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "ไม่พบโปรไฟล์บริษัท" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching public company profile:", error);
    res.status(500).send("Server Error");
  }
});

export default router;
