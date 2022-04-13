import express from 'express';
import { createProduct, editProduct, getProduct, getProducts } from '../controller/products.controller';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.post('/add-product', auth, adminAuth, createProduct);

router.post('/get-products', getProducts);

router.post('/get-product', getProduct);

router.post('/edit-product', auth, adminAuth, editProduct);

export default router;
