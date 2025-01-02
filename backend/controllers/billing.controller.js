import asyncHandler from 'express-async-handler';
import Billing from '../models/billing.model.js';

export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await Billing.create(req.body);
  res.status(201).json(invoice);
});

export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Billing.find().sort({ createdAt: -1 });
  res.json(invoices);
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const invoice = await Billing.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(invoice);
});