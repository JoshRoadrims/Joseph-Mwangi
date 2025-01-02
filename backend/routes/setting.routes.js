import express from "express";
import {getSettings,updateSettings } from '../controllers/setting.controller';

const router = express.Router()

router.get('/:userId', getSettings);
router.put('/:userId', updateSettings);

export default router;