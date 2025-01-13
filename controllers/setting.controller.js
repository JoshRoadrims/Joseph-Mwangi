import asyncHandler from 'express-async-handler';
import Setting from '../models/setting.model.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne({ userId: req.params.userId });
  res.json(settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOneAndUpdate(
    { userId: req.params.userId },
    req.body,
    { new: true, upsert: true }
  );
  res.json(settings);
});