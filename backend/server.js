import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'; // ช่วยให้เราใช้ตัวแปรจาก .env ได้

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import aiRoutes from './routes/ai.js';
import studentRoutes from './routes/students.js';
import interactionRoutes from './routes/interactions.js';
import workHistoryRoutes from './routes/workHistory.js';
import certificateRoutes from './routes/certificateFiles.js';
import contactFileRoutes from './routes/contactFile.js';
import applicationRoutes from './routes/applications.js';

//(สร้างแอปและตัวเชื่อมต่อฐานข้อมูล)
const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());

//สร้างเส้นทางทดสอบเพื่อเช็คว่าเซิร์ฟเวอร์ทำงานได้หรือไม่
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Job Board API!'});
});

//เพื่อให้ server สามารถเข้าถึงไฟล์ใน public/uploads ได้
app.use('/uploads', express.static('public/uploads'));

app.use('/api/auth', authRoutes); 
app.use('/api/profiles', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/work-history', workHistoryRoutes);
app.use('/api/certificate-files', certificateRoutes);
app.use('/api/contact-files', contactFileRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = process.env.PORT || 5001; //http://localhost:5001
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

process.on('beforeExit', async () =>{
    await prisma.$disconnect();
});