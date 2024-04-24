import mongoose from 'mongoose';
import { OrderStatus } from 'src/config';

const orderSchema = new mongoose.Schema({
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
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address',
  },
  /* 购买时间 */
  purchase_date: {
    type: Number,
    default: Date.now,
  },
  /* 订单状态 */
  status: {
    type: Number,
    enum: [OrderStatus.going, OrderStatus.complete, OrderStatus.canceled], // 0 => 正在配送, 1 => 已完成, 2 => 已取消
    default: 0,
  },
});

export const Order = mongoose.model('order', orderSchema);
