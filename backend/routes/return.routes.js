import express from "express";
import {createReturn, getReturns, updateReturnStatus} from '../controllers/return.controller';

const router = express.Router()

router.post('/', createReturn);
router.get('/', getReturns);
router.patch('/:id/status', updateReturnStatus);

export default router;