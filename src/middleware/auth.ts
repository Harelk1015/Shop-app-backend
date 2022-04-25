import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import HttpError from '../model/http-error';
import { IUser, UserDB } from '../model/user.model';
import {
	IAdminAuthMiddlewareRequest,
	IAuthMiddlewareRequest,
} from '../model/express/request/auth.request';

import generateAccessToken from '../utils/generateAccessToken';

interface IVerify {
	readonly _id: string;
	readonly iat: number;
	readonly exp: number;
}

let data: IVerify;

const auth: RequestHandler = async (req: IAuthMiddlewareRequest, res, next) => {
	let userDocument: Readonly<Omit<mongoose.Document, '_id'>> | null;

	try {
		const token = (req.header('Authorization') as string).replace('Bearer ', '');

		// Verfiy token
		jwt.verify(token, process.env.JWT_KEY!, (e, result) => {
			data = result! as IVerify;
		});

		if (data) {
			// Gets User by ID
			userDocument = await UserDB.findById(data._id);

			if (!userDocument) return next(new HttpError('unable to auth', 401));

			// Passes userDocument for admin authintication
			req.user = userDocument as IUser;

			return next();
		}

		// Checks validity of refresh token
		const refreshToken = (req.header('AuthorizationRefresh') as string).replace(
			'Bearer ',
			'',
		);

		// Checks for refreshToken in headers
		if (refreshToken == null) {
			return next(
				new HttpError('refresh token not valid, please log in again', 401),
			);
		}

		// Verfiy token
		data = jwt.verify(refreshToken, process.env.JWT_KEY!) as IVerify;

		// Get User by ID
		const user = await UserDB.findById(data._id);

		if (user) {
			const userTokens: string[] = [];

			user.tokens.map((token) => {
				userTokens.push(token.token);
			});

			// Checks current refreshToken
			if (!userTokens.includes(refreshToken)) {
				return next(new HttpError('refresh token too old, login again', 401));
			}
		}

		// Passes userDocument for admin authintication
		req.user = user as IUser;

		// Gets the id of the verified user inorder to generate new access token
		const verifiedUserId = jwt.verify(refreshToken, process.env.JWT_KEY!) as IVerify;

		// Generates new access token
		const accessToken = generateAccessToken(verifiedUserId._id);

		// Passes the new token to the req
		req.accessToken = accessToken;

		next();
	} catch (e: any) {
		return next(
			new HttpError(
				'jwt malformed , please delete all local storage files and login again',
				403,
			),
		);
	}
};

const adminAuth: RequestHandler = (req: IAdminAuthMiddlewareRequest, res, next) => {
	const user = req.user as IUser;

	if (user.role !== 'admin') {
		return next(new HttpError('User is not admin', 401));
	}

	next();
};

export { auth, adminAuth };
