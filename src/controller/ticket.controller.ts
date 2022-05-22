import { RequestHandler } from 'express';

import { ITicket, TicketDB } from '../model/ticket.model';
import HttpError from '../model/http-error';

import {
	ICreateTicketMiddlewareRequest,
	IGetTicketMiddlewareRequest,
} from '../model/express/request/ticket.request';
import ServiceGlobal from '../service-global';

export const createTicket: RequestHandler = async (
	req: ICreateTicketMiddlewareRequest,
	res,
	next,
) => {
	const { subject, email, message } = req.body;
	const userId = req.user!._id;

	ServiceGlobal.getInstance().logger.info(
		`<createTicket>: Start processing request to create A ticket for user with ID ${userId}`,
	);

	if (subject.length < 6) {
		ServiceGlobal.getInstance().logger.error(
			`<createTicket>: Failed to create A ticket for user with ID ${userId} because the subject is not valid`,
		);

		return next(new HttpError('Subject must be atleast 6 characters', 403));
	}

	const isEmailValid =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
			email,
		);

	if (!isEmailValid) {
		ServiceGlobal.getInstance().logger.error(
			`<createTicket>: Failed to create A ticket for user with ID ${userId} because the email is not valid`,
		);

		return next(new HttpError('Please enter A valid E-Mail', 403));
	}

	if (message.length < 15) {
		ServiceGlobal.getInstance().logger.error(
			`<createTicket>: Failed to create A ticket for user with ID ${userId} because the message is not valid`,
		);

		return next(new HttpError('Message must be atleast 15 characters', 403));
	}

	// From now on the ticket is valid
	try {
		const newTicket: ITicket = new TicketDB({
			subject,
			email,
			message,
			ownerId: userId,
		});

		await newTicket.save();

		ServiceGlobal.getInstance().logger.info(
			`<createTicket>: Succesffuly created ticket by user with ID ${userId}`,
		);

		res.status(201).send({ message: 'Ticket created successfully', newTicket });
	} catch (err) {
		ServiceGlobal.getInstance().logger.error(
			`<createTicket>: Failed to create ticket for user with ID ${userId} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const getTickets: RequestHandler = async (req, res, next) => {
	ServiceGlobal.getInstance().logger.info(
		'<getTickets>: Start processing to get all tickets by admin',
	);

	try {
		const tickets = await TicketDB.find();

		if (!tickets) {
			ServiceGlobal.getInstance().logger.error(
				'<getTickets>: Failed to get tickets because there are none',
			);

			return next(new HttpError('Could not find tickets', 404));
		}
		ServiceGlobal.getInstance().logger.info(
			'<getTickets>: Successfully fetched all tickets by admin',
		);

		res.status(200).send({ tickets });
	} catch (err) {
		ServiceGlobal.getInstance().logger.error(
			`<getTickets>: Failed to get tickets because of server error : ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const getTicket: RequestHandler = async (
	req: IGetTicketMiddlewareRequest,
	res,
	next,
) => {
	const { ticketId } = req.body;

	ServiceGlobal.getInstance().logger.info(
		`<getTicket>: Start processing to get ticket with ID ${ticketId} by admin`,
	);

	try {
		const ticket = await TicketDB.findById(ticketId);

		if (!ticket) {
			ServiceGlobal.getInstance().logger.error(
				`<getTicket>: Failed to get ticket with ID ${ticketId} because it was not found`,
			);

			return next(new HttpError('Could not find tickets', 404));
		}
		ServiceGlobal.getInstance().logger.info(
			`<getTicket>: Successfully fetched and retrived ticket with ID ${ticketId} by admin`,
		);

		res.status(200).send({ ticket });
	} catch (err) {
		ServiceGlobal.getInstance().logger.error(
			`<getTicket>: Failed to get ticket with ID ${ticketId} because of server err : ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};
