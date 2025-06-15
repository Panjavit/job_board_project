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
    try {
      const {
        fullName,
        contactEmail,
        lineUserId,
        education,
        bio,
        youtubeIntroLink,
      } = req.body;

      const updateProfile = await prisma.candidateProfile.update({
        where: { id: req.user.profileId },
        data: {
          fullName,
          contactEmail,
          lineUserId,
          education,
          bio,
          youtubeIntroLink,
        },
      });

      res.json(updateProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/profiles/company/me (Get current logged-in company's profile)
router.get('/company/me', protect, authorize('COMPANY'), async (req, res) =>{
    console.log(`--- ✅ Handler for GET /api/profiles/company/me was matched! User ID: ${req.user.id} ---`);
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