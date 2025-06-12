import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'; // ช่วยให้เราใช้ตัวแปรจาก .env ได้

//(สร้างแอปและตัวเชื่อมต่อฐานข้อมูล)
const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(express.json());

//สร้างเส้นทางทดสอบเพื่อเช็คว่าเซิร์ฟเวอร์ทำงานได้หรือไม่
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Job Board API!'});
});

const PORT = process.env.PORT || 5001; //http://localhost:5001
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

process.memoryUsage('beforeExit', async () =>{
    await prisma.$disconnect();
});