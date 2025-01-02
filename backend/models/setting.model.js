import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    orderUpdates: { type: Boolean, default: true }
  },
  defaultAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  language: {
    type: String,
    default: 'en'
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;