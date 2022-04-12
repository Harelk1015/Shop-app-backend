import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controller/user.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/add-favorite', auth, addFavorite);

router.post('/remove-favorite', auth, removeFavorite);

router.post('/get-favorites', auth, getFavorites);

export default router;
