import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    //required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  package: {
    weight: { type: Number, required: true },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    description: String
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    amount: { type: Number, required: true }
  },
  delivery: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    status: {
      type: String,
      enum: ['pending_pickup', 'picked_up', 'in_transit', 'delivered'],
      default: 'pending_pickup'
    }
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;


// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   orderNumber: { type: String, required: true, unique: true },
//   deliveryAddress: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String
//   },
//   items: [{
//     name: String,
//     quantity: Number,
//     price: Number
//   }],
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'in-transit', 'delivered'],
//     default: 'pending'
//   },
//   totalAmount: Number,
//   expectedDeliveryDate: Date,
//   createdAt: { type: Date, default: Date.now }
// });