import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    try {
      token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decode.user;

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }

    if(!token){
        return res.status(401).json( {message: 'Not authorized, no token'});
    }
};

// Middleware สำหรับตรวจสอบ Role (Authorization)
// รับค่าเป็น array ของ role ที่อนุญาต เช่น authorize('ADMIN'), authorize('ADMIN', 'COMPANY')
export const authorize = (...roles) => {
    return (req, res, next) => {
        // Middleware นี้ต้องทำงาน "หลัง" protect เสมอ เพราะต้องใช้ข้อมูลจาก req.user
        if (!req.user || !roles.includes(req.user.role)) {
            // ถ้า Role ของผู้ใช้ไม่ได้อยู่ในกลุ่มที่ได้รับอนุญาต
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next(); // ผ่านด่าน!
    };
};
