import express from 'express';
import { IUser } from '../../user.model';

export interface IChangePasswordMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		oldPassword: string;
		newPassword: string;
	}>;
}

export interface IAddFavoritedMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		productId: number;
	}>;
}

export interface IRemoveFavoritedMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		productId: number;
	}>;
}

export interface IGetFavoritesMiddlewareRequest extends express.Request {
	user?: IUser;
}
