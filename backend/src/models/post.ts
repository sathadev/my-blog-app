import * as mongoose from 'mongoose';

export interface Post extends mongoose.Document {
    title: string;
    content: string;
    creator: mongoose.Types.ObjectId; 
}

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<Post>('Post', postSchema);