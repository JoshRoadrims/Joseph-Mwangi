import express from "express";
import {createReturn, getReturns, updateReturnStatus} from '../controllers/return.controller.js';

const router = express.Router()

router.post('/', createReturn);
router.get('/', getReturns);
router.patch('/:id/status', updateReturnStatus);

export default router;