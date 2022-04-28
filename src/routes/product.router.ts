import express from 'express';

import { bodyKeys } from '../middleware/security';

import {
	createProduct,
	editProduct,
	getProduct,
	getProducts,
	deleteProduct,
	navSearch,
} from '../controller/products.controller';

import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.post(
	'/add-product',
	bodyKeys([
		{ key: 'name', type: 'string' },
		{ key: 'category', type: 'object' },
		{ key: 'sex', type: 'string' },
		{ key: 'sizes', type: 'object' },
		{ key: 'imageUrl', type: 'string' },
	]),
	auth,
	adminAuth,
	createProduct,
);

router.post(
	'/get-products',
	bodyKeys([
		{ key: 'kind', type: 'string' },
		{ key: 'sex', type: 'string' },
	]),
	getProducts,
);

router.post('/get-product', bodyKeys([{ key: '_id', type: 'string' }]), getProduct);

router.post('/nav-search', bodyKeys([{ key: 'searchInput', type: 'string' }]), navSearch);

router.post(
	'/edit-product',
	bodyKeys([
		{ key: '_id', type: 'string' },
		{ key: 'prodName', type: 'string' },
		{ key: 'prodPrice', type: 'number' },
		{ key: 'prodSizes', type: 'object' },
	]),
	auth,
	adminAuth,
	editProduct,
);

router.post(
	'/delete-product',
	bodyKeys([{ key: '_id', type: 'string' }]),
	auth,
	adminAuth,
	deleteProduct,
);

export default router;
