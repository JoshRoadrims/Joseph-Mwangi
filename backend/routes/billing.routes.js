import express from "express";
import billingController from '../controllers/billing.controller.js';
const router = express.Router()


router.post('/invoices', createInvoice);
router.get('/invoices', getInvoices);
router.patch('/invoices/:id/status', updatePaymentStatus);

export default router;