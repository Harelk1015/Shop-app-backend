import express from 'express';
import { addFavorite, changePassowrd, getFavorites, removeFavorite } from '../controller/user.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/change-password', auth, changePassowrd);

router.post('/add-favorite', auth, addFavorite);

router.post('/remove-favorite', auth, removeFavorite);

router.post('/get-favorites', auth, getFavorites);

export default router;
