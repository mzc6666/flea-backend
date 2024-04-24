import mongoose from 'mongoose';

const topCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  good: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'good',
  },
  content: String,
  comment_time: {
    type: Number,
    default: Date.now,
  },
});

const secondCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'topcomment',
  },
  content: {
    type: Number,
    default: Date.now,
  },
  comment_time: {
    type: Number,
    default: Date.now,
  },
});

export const TopComment = mongoose.model('topcomment', topCommentSchema);

export const SecondComment = mongoose.model(
  'secondcomment',
  secondCommentSchema,
);
