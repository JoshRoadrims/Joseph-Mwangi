import mongoose from 'mongoose';

const returnSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    ref: 'Order'
  },
  reason: {
    type: String,
    required: true,
    enum: ['damaged', 'wrong_item', 'not_needed', 'other']
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  returnLabel: {
    trackingNumber: String,
    url: String
  }
}, { timestamps: true });

const Return = mongoose.model('Return', returnSchema);

export default Return;