import mongoose from 'mongoose';

const previewSchema = new mongoose.Schema({
  /* 用户 */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  /* 物品id */
  good: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'good',
  },
  /* 收藏时间 */
  collect_date: {
    type: Number,
    default: Date.now,
  },
});

export const Collect = mongoose.model('collect', previewSchema);
