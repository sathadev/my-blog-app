import express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config(); // โหลด environment variables (เผื่อว่า server.ts ไม่ได้โหลด)

const app = express(); // สร้าง Express application

// --- เชื่อมต่อ MongoDB ---
// ใช้ process.env.MONGO_URI เพื่อดึง Connection String จากไฟล์ .env
// ใช้ as string เพื่อบอก TypeScript ว่า MONGO_URI จะไม่เป็น undefined
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('Connected to MongoDB Atlas!'); // แสดงข้อความเมื่อเชื่อมต่อสำเร็จ
    })
    .catch((error) => {
        console.log('Connection to MongoDB failed!', error); // แสดงข้อความและ Error เมื่อเชื่อมต่อล้มเหลว
    });

// --- Middleware ---
// ใช้ bodyParser.json() เพื่อให้ Express สามารถอ่าน JSON body ที่ส่งมาใน Request ได้
app.use(bodyParser.json());
// ใช้ bodyParser.urlencoded() สำหรับข้อมูลแบบ URL-encoded (extended: false คือไม่รองรับ object ซับซ้อน)
app.use(bodyParser.urlencoded({ extended: false }));

// --- CORS Headers ---
// Middleware นี้มีไว้เพื่อจัดการ Cross-Origin Resource Sharing (CORS)
// ซึ่งจำเป็นเมื่อ Frontend (Angular) และ Backend (Node.js) รันอยู่คนละ Port/Domain
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // อนุญาตให้ทุกโดเมนสามารถเรียก API ได้ (ใน Production ควรกำหนดโดเมนที่แน่นอนเพื่อความปลอดภัย)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // อนุญาต Header ที่จำเป็นสำหรับ Request
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // อนุญาต HTTP Methods ที่จำเป็น (OPTIONS สำหรับ Pre-flight requests)
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS, PUT'
    );
    next(); // ไปยัง Middleware หรือ Route ถัดไป
});

// --- Routes ---
// ทุก Request ที่เริ่มต้นด้วย /api/posts จะถูกส่งไปให้ postRoutes จัดการ
import postRoutes from './routes/posts'; // ต้อง import หลังจากการตั้งค่า app.use
app.use('/api/posts', postRoutes);

// ทุก Request ที่เริ่มต้นด้วย /api/user จะถูกส่งไปให้ userRoutes จัดการ (สำหรับ User Authentication)
import userRoutes from './routes/users'; // ต้อง import หลังจากการตั้งค่า app.use
app.use('/api/user', userRoutes);

export { app }; // Export Express app เพื่อให้ server.ts สามารถนำไปใช้ได้