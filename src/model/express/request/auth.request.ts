import express from 'express';

export interface IAuthMiddlewareRequest extends express.Request {
	userId?: string;
	user?: any;
	accessToken?: string;
}
