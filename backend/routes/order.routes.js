import express from "express";
import { createOrder, getOrderByTracking, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router()

router.post('/', createOrder);
router.get('/track/:trackingNumber', getOrderByTracking);
router.patch('/:trackingNumber/status', updateOrderStatus);

export default router;