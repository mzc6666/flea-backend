import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    match:
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
  },
  province: String, // 省
  city: String, // 市
  district: String, // 区
  extra: String, // 其他描述
  isDefault: Boolean, // 是否是默认地址

  // TODO 还有其他信息
});

export const Address = mongoose.model('address', addressSchema);
