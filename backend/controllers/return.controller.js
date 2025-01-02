import asyncHandler from 'express-async-handler';
import Return from '../models/return.model.js';

export const createReturn = asyncHandler(async (req, res) => {
  const returnRequest = await Return.create(req.body);
  res.status(201).json(returnRequest);
});

export const getReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find().sort({ createdAt: -1 });
  res.json(returns);
});

export const updateReturnStatus = asyncHandler(async (req, res) => {
  const returnRequest = await Return.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(returnRequest);
});