import express from 'express';
import {
	createProduct,
	editProduct,
	getProduct,
	getProducts,
	deleteProduct,
} from '../controller/products.controller';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.post('/add-product', auth, adminAuth, createProduct);

router.post('/get-products', getProducts);

router.post('/get-product', getProduct);

router.post('/edit-product', auth, adminAuth, editProduct);

router.post('/delete-product', auth, adminAuth, deleteProduct);

export default router;
