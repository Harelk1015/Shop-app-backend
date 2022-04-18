import express from 'express';
import { IUser } from '../../user.model';

export interface ICartMiddlewareRequest extends express.Request {
	user?: IUser;
}
