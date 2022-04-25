import { Express } from 'express';
import mongoose from 'mongoose';
import { IUser } from '../../user.model';

export interface ICreateProductMiddlewareRequest extends Express.Request {
	user?: IUser;
	readonly body: Readonly<{
		name: string;
		price: number;
		category: { sex: string; kind: string };
		sizes: [string];
		imageUrl: string;
	}>;
}

export interface IGetProductsMiddlewareRequest extends Express.Request {
	user?: IUser;
	readonly body: Readonly<{
		sex: string;
		kind: string;
	}>;
}

export interface IGetProductMiddlewareRequest extends Express.Request {
	readonly body: Readonly<{
		_id: mongoose.Types.ObjectId;
	}>;
}

export interface IEditProductMiddlewareRequest extends Express.Request {
	readonly body: Readonly<{
		_id: mongoose.Types.ObjectId;
		prodName: string;
		prodPrice: number;
		prodSizes: number[];
	}>;
}

export interface IDeleteProductMiddlewareRequest extends Express.Request {
	readonly body: Readonly<{
		_id: mongoose.Types.ObjectId;
	}>;
}

export interface INavSearchProductMiddlewareRequest extends Express.Request {
	readonly body: Readonly<{
		searchInput: string;
	}>;
}
