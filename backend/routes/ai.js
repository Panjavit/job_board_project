import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

//ดึง API Key มาจากไฟล์ .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//เลือกรุ่นของ AI ที่จะใช้
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); //รุ่น Flash เพราะเร็วและเพียงพอ

// @route   POST /api/ai/suggest-skills  แนะนำ Skill ที่จำเป็นสำหรับตำแหน่งงานที่ระบุ

router.post(
  "/suggest-skills",
  protect, //Middleware ตรวจสอบว่าล็อกอินหรือยัง
  authorize("CANDIDATE"), //Middleware ตรวจสอบว่าเป็นนักศึกษาหรือไม่
  async (req, res) => {
    //ดึงชื่อตำแหน่งงานจาก Request Body
    const { position } = req.body;

    //ตรวจสอบว่ามีการส่งชื่อตำแหน่งมาหรือไม่
    if (!position || position.trim() === "") {
      return res.status(400).json({ message: "กรุณาระบุชื่อตำแหน่งงาน" });
    }

    //สร้าง Prompt(ชุดคำสั่ง) ที่จะส่งให้ AI
    //เราจะสั่งให้ AI ตอบกลับมาในรูปแบบ JSON ที่ชัดเจนเพื่อง่ายต่อการนำไปใช้
    const prompt = `List the top 20 essential skills for an internship position as a "${position}". Return the response as a valid JSON object with a single key "skills" which is an array of strings. For example: { "skills": ["React", "JavaScript", "CSS"] }`;

    try {
      //ส่ง Prompt ไปให้ AI ประมวลผล
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      //แปลงข้อความที่ AI ตอบกลับมาให้เป็น JSON Object  บางครั้ง AI จะครอบคำตอบด้วย ```json ... ``` เราจึงต้องตัดส่วนนั้นทิ้งก่อน
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const skillsJson = JSON.parse(cleanedText);

      //ส่งข้อมูล Skills กลับไปให้ Frontend
      res.json(skillsJson);

    } catch (error) {
      console.error("Error calling AI or parsing response:", error);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการขอคำแนะนำจาก AI" });
    }
  }
);

export default router;