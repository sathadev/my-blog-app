import { app } from './app';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config(); // โหลด environment variables จาก .env เมื่อ server เริ่มทำงาน

const port = process.env.PORT || 3000; // กำหนด Port ให้ Backend ใช้ (ถ้าไม่มีใน .env ก็ใช้ 3000)

app.set('port', port); // ตั้งค่า port ให้กับ Express app
const server = http.createServer(app); // สร้าง HTTP server โดยใช้ Express app

// สั่งให้ server เริ่มฟัง Request ที่ port ที่กำหนด
server.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});