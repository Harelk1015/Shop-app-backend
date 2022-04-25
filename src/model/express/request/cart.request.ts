import express from 'express';

import { IUser } from '../../user.model';

export interface IMakeCartMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		_id: string;
		name: string;
		price: number;
		size: string;
		quantity: number;
		imageUrl: string;
	}>;
}

export interface ISetCartMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		prodId: string;
		quantity: number;
	}>;
}

export interface IRemoveCartMiddlewareRequest extends express.Request {
	user?: IUser;
	readonly body: Readonly<{
		_id: string;
	}>;
}
