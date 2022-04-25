import express from 'express';

import { bodyKeys } from '../middleware/security';

import { addFavorite, changePassowrd, getFavorites, removeFavorite } from '../controller/user.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post(
	'/change-password',
	bodyKeys([
		{ key: 'oldPassword', type: 'string' },
		{ key: 'newPassword', type: 'string' },
	]),
	auth,
	changePassowrd,
);

router.post('/add-favorite', bodyKeys([{ key: 'productId', type: 'string' }]), auth, addFavorite);

router.post('/remove-favorite', bodyKeys([{ key: 'productId', type: 'string' }]), auth, removeFavorite);

router.post('/get-favorites', auth, getFavorites);

export default router;
