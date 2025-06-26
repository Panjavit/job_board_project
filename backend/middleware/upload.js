import multer from 'multer';
import path from 'path';

//กำหนดตำแหน่งที่จะเก็บไฟล์และวิธีตั้งชื่อไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //กำหนดให้เก็บไฟล์ในโฟลเดอร์ public/uploads
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    //ตั้งชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำ: ชื่อไฟล์เดิม + timestamp + นามสกุลเดิม
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

//สร้าง instance ของ multer พร้อมกับการตั้งค่า
const upload = multer({ storage: storage });

export default upload;