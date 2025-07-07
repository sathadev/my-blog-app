import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs'; // สำหรับ Hash รหัสผ่าน
import * as jwt from 'jsonwebtoken'; // สำหรับสร้างและตรวจสอบ JWT
import User from '../models/user';

const router = Router(); 
router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash // เก็บ Password ที่ Hash แล้ว
            });
            user.save() // บันทึกผู้ใช้ใหม่ลง MongoDB
                .then(result => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Creating user failed!',
                        error: err 
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Password hashing failed!',
                error: error
            });
        });
});

// --- User Login (POST /api/user/login) ---
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    let fetchedUser: any;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // เมื่อส่ง Response ไปแล้ว ให้ return เพื่อออกจาก .then block นี้ทันที
                res.status(401).json({
                    message: 'Auth failed: User not found!'
                });
                return; // <--- เพิ่มบรรทัดนี้
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                // เมื่อส่ง Response ไปแล้ว ให้ return เพื่อออกจาก .then block นี้ทันที
                res.status(401).json({
                    message: 'Auth failed: Incorrect password!'
                });
                return; // <--- เพิ่มบรรทัดนี้
            }
            // Generate JWT
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                process.env.JWT_KEY as string,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            // Error handling สำหรับทั้ง Promise chain
            res.status(401).json({
                message: 'Auth failed: Something went wrong!'
            });
        });
});

export default router;