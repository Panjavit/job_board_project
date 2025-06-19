import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// @route   GET /api/profiles/candidate/me (Get current logged-in candidate's profile)
router.get(
  "/candidate/me",
  protect,
  authorize("CANDIDATE"),
  async (req, res) => {
    try {
      const profile = await prisma.candidateProfile.findUnique({
        where: { id: req.user.profileId },
        include: {
          skills: { //ดึงข้อมูล skill ทั้งหมดทีผูกกับโปรไฟล์นี้
            include: {
              skill: true, //เอาชื่อ Skill มาด้วย
            }
          }
        }
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

// @route   PUT /api/profiles/candidate/me (Update current logged-in candidate's profile)
router.put(
  "/candidate/me",
  protect,
  authorize("CANDIDATE"),
  async (req, res) => {
      const {
        fullName,
        contactEmail,
        lineUserId,
        major,            
        studyYear,
        bio,
        youtubeIntroLink,
        desiredPosition,
        skills,
      } = req.body;

      try {
      //ใช้ Prisma Transaction เพื่อจัดการหลาย Operation พร้อมกัน
      await prisma.$transaction(async (tx) => {

        //ดึงโปรไฟล์ปัจจุบันเพื่อตรวจสอบว่ามีรหัสหรือยัง
        const currentProfile = await tx.candidateProfile.findUnique({
          where: {id: req.user.profileId},
          select: {studentCode: true}
        })

        let studentCode = currentProfile.studentCode //ใช้รหัสเดิมเป็นค่าเริ่มต้น

        //สร้างรหัสก็ต่อเมื่อ "ยังไม่มีรหัส" และ "มีการกรอก desiredPosition"
        if(!studentCode && desiredPosition){
          const prefix = desiredPosition // สร้าง Prefix จาก desiredPosition (เช่น "Backend Developer" -> "BD")
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase(); 

          //ค้นหาคนล่าสุดที่มีรหัสขึ้นต้นด้วย Prefix เดียวกัน
          const lastStudentWithPrefix = await tx.candidateProfile.findFirst({
            where: {
              studentCode: {startsWith: prefix},
            },
            orderBy: {studentCode: 'desc'},
          })
          let newNumber = 1;
          if(lastStudentWithPrefix && lastStudentWithPrefix.studentCode){ //ถ้าเจอดึงตัวเลขออกมาแล้วบวก 1
            const lastNumber = parseInt(lastStudentWithPrefix.studentCode.replace(prefix, ''),10);
            newNumber = lastNumber + 1;
          }
          //สร้างรหัสใหม่พร้อมกับเติม 0 ข้างหน้า (เช่น BD01, BD02)
          studentCode = `${prefix}${String(newNumber).padStart(2, '0')}`;
        }



        //อัปเดตข้อมูลพื้นฐานใน CandidateProfile
        await tx.candidateProfile.update({ //tx(transaction)  Transaction รับประกันว่าการทำงานกับฐานข้อมูลหลายๆ อย่างที่อยู่ข้างใน จะต้องสำเร็จทั้งหมด หรือล้มเหลวทั้งหมด
          where: { id: req.user.profileId },
          data: {
            fullName,
            contactEmail,
            lineUserId,
            major,
            studyYear,
            bio,
            youtubeIntroLink,
            desiredPosition,
            studentCode,
          },
        });

        // 2.2 ล้าง Skill เก่าทั้งหมดของ user คนนี้ทิ้งก่อน
        await tx.userSkill.deleteMany({
          where: { candidateProfileId: req.user.profileId },
        });

        // 2.3 เพิ่ม Skill ที่ส่งมาใหม่ทั้งหมด
        if (skills && skills.length > 0) {
          for (const userSkill of skills) {
            // ค้นหาหรือสร้าง Skill ใหม่ในตาราง 'Skill'
            const skillRecord = await tx.skill.upsert({ //ให้ไปหาทักษะชื่อนี้ ถ้ามีอยู่แล้วก็ใช้ id เดิม
              where: { name: userSkill.skillName },
              update: {},
              create: { name: userSkill.skillName },
            });

            // สร้างความสัมพันธ์ในตาราง 'UserSkill' พร้อมกับ rating
            await tx.userSkill.create({
              data: {
                candidateProfileId: req.user.profileId,
                skillId: skillRecord.id,
                rating: parseInt(userSkill.rating, 10),
              },
            });
          }
        }
      });

      // 3. ดึงข้อมูลโปรไฟล์ล่าสุดพร้อม Skill ทั้งหมดเพื่อส่งกลับไป
      const finalProfile = await prisma.candidateProfile.findUnique({
        where: { id: req.user.profileId },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });

      res.json(finalProfile);

    } catch (error) {
      console.error("Error updating candidate profile with skills:", error);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/profiles/company/me (Get current logged-in company's profile)
router.get('/company/me', protect, authorize('COMPANY'), async (req, res) =>{
    console.log(` Handler for GET /api/profiles/company/me was matched! User ID: ${req.user.id} ---`);
    try {
        const profile = await prisma.companyProfile.findUnique({
            where: {id: req.user.profileId}
        });
        if(!profile){
            return res.status(404).json({message: 'ไม่พบโปรไฟล์บริษัท'})
        }
        res.json(profile);
    } catch (error) {
        console.error("Error in GET /company/me:", error);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/profiles/company/me (Update current logged-in company's profile)
router.put('/company/me', protect, authorize('COMPANY'), async (req, res) =>{
    try {
        const { companyName, about, contactInstructions } = req.body;
        const updateProfile = await prisma.companyProfile.update({
            where: {id: req.user.profileId},
            data: {
                companyName: companyName,
                about: about,
                contactInstructions: contactInstructions
            }
        });
        res.json(updateProfile);
    } catch (error) {
        console.error("Error in PUT /company/me:", error);
        res.status(500).send('Server Error');
    }
});

export default router;