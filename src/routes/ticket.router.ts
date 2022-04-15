import express from 'express';
import { createTicket, getTicket, getTickets } from '../controller/ticket.controller';
import { adminAuth, auth } from '../middleware/auth';

const router = express.Router();

router.post('/add-ticket', auth, createTicket);

router.get('/get-tickets', auth, adminAuth, getTickets);

router.post('/get-ticket', auth, adminAuth, getTicket);

export default router;
