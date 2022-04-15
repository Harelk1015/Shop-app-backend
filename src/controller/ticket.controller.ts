/* eslint-disable operator-linebreak */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import { IUserMiddlewareRequest } from '../model/express/request/ticket.request';
import HttpError from '../model/http-error';
import { ITicket, TicketDB } from '../model/ticket.model';

export const createTicket: RequestHandler = async (req: IUserMiddlewareRequest, res, next) => {
	const { subject, email, message } = req.body;
	const userId = req?.user?._id;

	if (subject.length < 6) {
		return next(new HttpError('Subject must be atleast 6 characters', 403));
	}

	const isEmailValid =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
			email,
		);

	if (!isEmailValid) {
		return next(new HttpError('Please enter A valid E-Mail', 403));
	}

	if (message.length < 15) {
		return next(new HttpError('Message must be atleast 15 characters', 403));
	}

	// From now on the ticket is valid

	const newTicket: ITicket = new TicketDB({ subject, email, message, ownerId: userId });
	try {
		await newTicket.save();

		res.status(201).json({ message: 'Ticket created successfully', newTicket });
	} catch (err) {
		console.log(err);
	}
};

export const getTickets: RequestHandler = async (req, res, next) => {
	try {
		const tickets = await TicketDB.find();

		res.status(200).json({ tickets });
	} catch (err) {
		return next(new HttpError('Could not find tickets', 404));
	}
};

export const getTicket: RequestHandler = async (req, res, next) => {
	const { ticketId } = req.body;

	try {
		const ticket = await TicketDB.findById(ticketId);

		if (!ticket) {
			return next(new HttpError('Could not find tickets', 404));
		}

		res.status(200).json({ ticket });
	} catch (err) {
		return next(new HttpError('Could not find tickets', 404));
	}
};
