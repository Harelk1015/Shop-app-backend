import express from 'express';

import { bodyKeys } from '../middleware/security';

import { addItem, removeCartItem, setCartItem } from '../controller/cart.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post(
	'/',
	bodyKeys([
		{ key: '_id', type: 'string' },
		{ key: 'name', type: 'string' },
		{ key: 'price', type: 'number' },
		{ key: 'size', type: 'string' },
		{ key: 'quantity', type: 'number' },
		{ key: 'imageUrl', type: 'string' },
	]),
	auth,
	addItem,
);

router.post(
	'/set-cart',
	bodyKeys([
		{ key: 'prodId', type: 'string' },
		{ key: 'quantity', type: 'number' },
		// { key: 'size', type: 'string' },
	]),
	auth,
	setCartItem,
);

router.post(
	'/remove-cart-item',
	bodyKeys([{ key: '_id', type: 'string' }]),
	auth,
	removeCartItem,
);

export default router;
