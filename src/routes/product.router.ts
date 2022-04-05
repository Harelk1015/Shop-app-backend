import express from 'express';
import { createProduct } from '../controller/products.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/addProduct', auth, createProduct);

export default router;
