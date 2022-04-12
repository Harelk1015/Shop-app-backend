import express from 'express';
import { IUser } from '../../user.model';

export interface IUserMiddlewareRequest extends express.Request {
	user?: IUser;
}
