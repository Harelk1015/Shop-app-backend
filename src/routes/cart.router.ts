import express from 'express';
import { makeCart, removeCartItem, setCartItem } from '../controller/cart.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, makeCart);

router.post('/set-cart', auth, setCartItem);

router.post('/remove-cart-item', auth, removeCartItem);

export default router;
