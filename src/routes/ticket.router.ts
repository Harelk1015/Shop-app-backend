import express from 'express';

import { bodyKeys } from '../middleware/security';

import { createTicket, getTicket, getTickets } from '../controller/ticket.controller';
import { adminAuth, auth } from '../middleware/auth';

const router = express.Router();

router.post(
	'/add-ticket',
	bodyKeys([
		{ key: 'subject', type: 'string' },
		{ key: 'email', type: 'string' },
		{ key: 'message', type: 'string' },
	]),
	auth,
	createTicket,
);

router.get('/get-tickets', auth, adminAuth, getTickets);

router.post('/get-ticket', auth, bodyKeys([{ key: 'ticketId', type: 'string' }]), adminAuth, getTicket);

export default router;
