import express from 'express';
import { createProduct } from '../controller/products.controller';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

router.post('/addProduct', auth, adminAuth, createProduct);

export default router;
