import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

// Create new order
export const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

// Get order by tracking number
export const getOrderByTracking = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ trackingNumber: req.params.trackingNumber });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { trackingNumber: req.params.trackingNumber },
    { 'delivery.status': req.body.status },
    { new: true }
  );
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});