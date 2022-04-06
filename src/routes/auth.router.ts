import express from 'express';
import { autoLogin, login, register } from '../controller/auth.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/autologin', auth, autoLogin);

export default router;
