import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, authorize } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

// --- Email Routes ---
router.post('/emails', protect, authorize('COMPANY'), async (req, res) => {
    const { email } = req.body;
    const newEmail = await prisma.companyEmail.create({
        data: { email, companyProfileId: req.user.profileId }
    });
    res.status(201).json(newEmail);
});

router.delete('/emails/:id', protect, authorize('COMPANY'), async (req, res) => {
    await prisma.companyEmail.delete({ where: { id: req.params.id } });
    res.status(204).send();
});

// --- Phone Routes ---
router.post('/phones', protect, authorize('COMPANY'), async (req, res) => {
    const { phone } = req.body;
    const newPhone = await prisma.companyPhone.create({
        data: { phone, companyProfileId: req.user.profileId }
    });
    res.status(201).json(newPhone);
});

router.delete('/phones/:id', protect, authorize('COMPANY'), async (req, res) => {
    await prisma.companyPhone.delete({ where: { id: req.params.id } });
    res.status(204).send();
});

export default router;