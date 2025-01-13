import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  dueDate: Date,
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }]
}, { timestamps: true });

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;