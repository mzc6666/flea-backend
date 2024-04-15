import mongoose from 'mongoose';

const previewSchema = new mongoose.Schema({
  /* 用户id */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  /* 物品id */
  good: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'good',
  },
  /* 预览时间 */
  preview_date: {
    type: Number,
    default: Date.now,
  },
});

export const Preview = mongoose.model('preview', previewSchema);
