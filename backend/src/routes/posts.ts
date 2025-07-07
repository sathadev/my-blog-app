import { Router, Request, Response, NextFunction } from 'express';
import Post, { Post as IPost } from '../models/post'; // Import Post Model และ Interface Post
import checkAuth from '../middleware/check-auth'; // Import Middleware ตรวจสอบสิทธิ์
import * as mongoose from 'mongoose';
const router = Router();


interface AuthRequest extends Request {
    userData?: { email: string; userId: string };
}

// --- Create Post (POST /api/posts) ---
router.post('', checkAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
    // สร้าง Post Object ใหม่จากข้อมูลใน req.body และ userId จาก Token
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData?.userId
    });

   post.save().then(createdPost => {
    // เราจะ populate creator ที่เพิ่งสร้างทันที
    createdPost.populate('creator', 'email').then(populatedPost => {
         res.status(201).json({
            message: 'Post added successfully',
            postId: populatedPost._id,
            creator: populatedPost.creator // ส่งข้อมูล creator กลับไปด้วย
        });
    });
}).catch(error => {
        res.status(500).json({
            message: 'Creating a post failed!'
        });
    });
});

// --- Get All Posts (GET /api/posts) ---
router.get('', (req: Request, res: Response, next: NextFunction) => {
    Post.find()
        .populate('creator', 'email') // <-- เพิ่มบรรทัดนี้
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: documents.map(doc => ({
                    id: doc._id,
                    title: doc.title,
                    content: doc.content,
                    creator: doc.creator
                }))
            });
        }).catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
});
// --- Get Single Post by ID (GET /api/posts/:id) ---
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            // ถ้าพบ Post ให้ส่งข้อมูลกลับไป
            res.status(200).json({
                id: post._id,
                title: post.title,
                content: post.content,
                creator: post.creator
            });
        } else {
            res.status(404).json({ message: 'Post not found!' }); // ไม่พบโพสต์
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching post failed!'
        });
    });
});

// --- Update Post (PUT /api/posts/:id) ---
router.put('/:id', checkAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
    const post = {
        title: req.body.title,
        content: req.body.content,
    };

    Post.updateOne({ _id: req.params.id, creator: req.userData?.userId }, {
        title: req.body.title,
        content: req.body.content
    }).then(result => {
        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Update successful!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' }); 
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Couldn\'t update post!'
        });
    });
});

// --- Delete Post (DELETE /api/posts/:id) ---
router.delete('/:id', checkAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData?.userId }).then(result => {
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Deletion successful!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' }); 
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Deleting post failed!'
        });
    });
});

export default router;