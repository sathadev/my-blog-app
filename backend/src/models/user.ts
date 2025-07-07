import * as mongoose from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator'); // <-- เปลี่ยนตรงนี้

// กำหนด Interface สำหรับ User
export interface User extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<User>('User', userSchema);