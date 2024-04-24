import mongoose from 'mongoose';
import { UseLevel } from 'src/config';

const goodSchema = new mongoose.Schema({
  photos: [String],
  desc: String,
  price: String,
  longitude: Number,
  latitude: Number,
  // 使用程度
  status: {
    type: Number,
    enum: [
      UseLevel.excellent,
      UseLevel.slightUse,
      UseLevel.fine,
      UseLevel.ordinary,
    ],
  },
  publish_date: {
    type: Number,
    default: Date.now,
  },
  /* 用户id */
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  /* 更新时间 */
  update_time: {
    type: Number,
    default: Date.now,
  },
  /* 物品状态  */
  on_sale: {
    type: Boolean,
    default: true,
  },
});

export const Good = mongoose.model('good', goodSchema);
