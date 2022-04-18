import express from 'express';
import { makeCart } from '../controller/cart.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, makeCart);

export default router;
