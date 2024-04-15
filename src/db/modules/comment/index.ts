import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  // TODO
});

export const Comment = mongoose.model('comment', commentSchema);
