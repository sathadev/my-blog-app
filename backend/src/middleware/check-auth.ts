import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// ขยาย Request Interface ของ Express เพื่อเพิ่ม property 'userData'
// 'userData' จะเก็บข้อมูลผู้ใช้ที่ถอดรหัสจาก JWT (email และ userId)
interface AuthRequest extends Request {
    userData?: { email: string; userId: string };
}

// Middleware สำหรับตรวจสอบ JWT (JSON Web Token)
// ฟังก์ชันนี้จะถูกเรียกใช้ก่อน Route ที่ต้องการการยืนยันตัวตน
export default (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // ดึง Token จาก Header 'Authorization' ของ Request
        // รูปแบบที่คาดหวังคือ "Bearer <TOKEN>"
        const token = req.headers.authorization?.split(' ')[1]; // ใช้ optional chaining เผื่อ req.headers.authorization เป็น undefined
        if (!token) {
            throw new Error('No token provided!'); // ถ้าไม่มี Token ให้โยน Error
        }
        // ตรวจสอบความถูกต้องของ Token โดยใช้ Secret Key ที่เก็บไว้ใน Environment Variable (JWT_KEY)
        // ผลลัพธ์จากการ verify จะเป็นข้อมูลที่เคยถูกเข้ารหัสไว้ใน Token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY as string) as { email: string; userId: string };
        // เก็บข้อมูลที่ถอดรหัสแล้วใน req.userData เพื่อให้ Route ถัดไปสามารถเข้าถึงข้อมูลผู้ใช้ได้
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next(); // เรียก next() เพื่อให้ Request ดำเนินการไปยัง Middleware หรือ Route ถัดไป
    } catch (error) {
        // ถ้า Token ไม่ถูกต้อง (เช่น หมดอายุ, ถูกแก้ไข, ไม่ได้ส่งมา) ให้ส่ง Status 401 (Unauthorized)
        res.status(401).json({ message: 'You are not authenticated!' });
    }
};