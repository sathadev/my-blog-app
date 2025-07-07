# My Blog - A MEAN Stack Application 📝

นี่คือโปรเจกต์ Blog Application ที่สร้างขึ้นด้วยเทคโนโลยี MEAN Stack แบบ Full-Stack ประกอบด้วยระบบสมาชิกและการจัดการโพสต์ (สร้าง, อ่าน, แก้ไข, ลบ)

---

## ✨ Features

* **User Authentication**: สมัครสมาชิก, ล็อกอิน, และยืนยันตัวตนด้วย JSON Web Tokens (JWT)
* **Post Management (CRUD)**: ผู้ใช้ที่ล็อกอินแล้วสามารถสร้าง, อ่าน, แก้ไข, และลบโพสต์ของตัวเองได้
* **Authorization**: จำกัดสิทธิ์ให้ผู้ใช้สามารถแก้ไขและลบได้เฉพาะโพสต์ที่ตัวเองสร้างเท่านั้น

---

## 🛠️ Tech Stack

* **MongoDB**: ฐานข้อมูล NoSQL สำหรับเก็บข้อมูล Users และ Posts
* **Express.js**: Framework สำหรับสร้าง Backend API
* **Angular**: Framework สำหรับสร้างหน้าเว็บ Frontend (SPA)
* **Node.js**: สภาพแวดล้อมสำหรับรัน JavaScript ฝั่ง Server

---

## 🚀 Getting Started

ทำตามขั้นตอนต่อไปนี้เพื่อติดตั้งและรันโปรเจกต์บนเครื่องของคุณ

### Prerequisites

คุณต้องมีโปรแกรมเหล่านี้ติดตั้งอยู่บนเครื่องก่อน:
* [Node.js](https://nodejs.org/en/) (เวอร์ชัน 18.x ขึ้นไป)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* ฐานข้อมูล MongoDB (สามารถใช้ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ที่เป็นบริการบน Cloud ได้ฟรี)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-folder>
    ```

2.  **ตั้งค่า Backend:**
    * เข้าไปที่โฟลเดอร์ `backend`:
        ```bash
        cd backend
        ```
    * ติดตั้ง dependencies:
        ```bash
        npm install
        ```
    * **สร้างไฟล์ `.env`** โดยคัดลอกมาจาก `.env.template` แล้วใส่ค่าของคุณลงไป:
        ```env
        # ที่อยู่สำหรับเชื่อมต่อ MongoDB
        MONGO_URI=your_mongodb_connection_string

        # Secret Key สำหรับสร้าง JWT
        JWT_KEY=your_super_secret_key_for_jwt
        ```
    * กลับออกมาที่โฟลเดอร์หลัก:
        ```bash
        cd ..
        ```

3.  **ตั้งค่า Frontend:**
    * เข้าไปที่โฟลเดอร์ `blog-frontend`:
        ```bash
        cd blog-frontend
        ```
    * ติดตั้ง dependencies:
        ```bash
        npm install
        ```

---

## 💻 Usage

คุณต้องเปิด Terminal 2 อันเพื่อรันโปรเจกต์

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run start:dev
