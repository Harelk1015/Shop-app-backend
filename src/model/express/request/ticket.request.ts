import express from 'express';
import { IUser } from '../../user.model';

export interface ICreateTicketMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		subject: string;
		message: string;
		email: string;
	}>;
}
export interface IGetTicketMiddlewareRequest extends express.Request {
	readonly body: Readonly<{
		ticketId: string;
	}>;
}
