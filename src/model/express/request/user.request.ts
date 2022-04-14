import express from 'express';
import { IUser } from '../../user.model';

export interface IUserMiddlewareRequest extends express.Request {
	user?: IUser;
}

export interface IChangePasswordMiddlewareRequest extends express.Request {
	user?: IUser;
	body: {
		oldPassword?: string;
		newPassword?: string;
	};
}
