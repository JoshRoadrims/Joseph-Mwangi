import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalShipments: { $sum: 1 },
        pendingPickup: {
          $sum: { $cond: [{ $eq: ['$delivery.status', 'pending_pickup'] }, 1, 0] }
        },
        inTransit: {
          $sum: { $cond: [{ $eq: ['$delivery.status', 'in_transit'] }, 1, 0] }
        },
        delivered: {
          $sum: { $cond: [{ $eq: ['$delivery.status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    stats: stats[0] || {
      totalShipments: 0,
      pendingPickup: 0,
      inTransit: 0,
      delivered: 0
    },
    recentOrders
  });
});