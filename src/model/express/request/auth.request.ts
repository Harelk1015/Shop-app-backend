import express from 'express';
import { IUser } from '../../user.model';

export interface IAuthMiddlewareRequest extends express.Request {
	user?: IUser;
	accessToken?: string;
}
export interface IAdminAuthMiddlewareRequest extends express.Request {
	user?: IUser;
}

export interface IRegisterMiddlewareRequest extends express.Request {
	readonly body: Readonly<{
		username: string;
		email: string;
		password: string;
		passwordConfirmation: string;
	}>;
}
export interface ILoginMiddlewareRequest extends express.Request {
	readonly body: Readonly<{
		email: string;
		password: string;
	}>;
	user?: IUser;
}
export interface IAutoLoginMiddlewareRequest extends express.Request {
	user?: IUser;
}
