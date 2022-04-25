import express from 'express';

import { bodyKeys } from '../middleware/security';

import { autoLogin, login, register } from '../controller/auth.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post(
	'/register',
	bodyKeys([
		{ key: 'username', type: 'string' },
		{ key: 'email', type: 'string' },
		{ key: 'password', type: 'string' },
		{ key: 'passwordConfirmation', type: 'string' },
	]),
	register,
);

router.post(
	'/login',
	bodyKeys([
		{ key: 'email', type: 'string' },
		{ key: 'password', type: 'string' },
	]),
	login,
);

router.get('/autologin', auth, autoLogin);

export default router;
