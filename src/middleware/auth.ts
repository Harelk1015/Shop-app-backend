import express, { RequestHandler } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import HttpError from '../model/http-error';

import { IUser, UserDB } from '../model/user.model';
import generateAccessToken from '../utils/generateAccessToken';

interface IAuthMiddlewareRequest extends express.Request {
	userId?: string;
	user?: any;
	accessToken?: string;
}

interface IVerify {
	readonly _id: string;
	readonly iat: number;
	readonly exp: number;
}

let data: IVerify;
const auth: RequestHandler = async (req: IAuthMiddlewareRequest, res, next) => {
	let userDocument: Readonly<Omit<mongoose.Document, '_id'>> | null;

	try {
		// Gets the token
		const token = (req.header('Authorization') as string).replace('Bearer ', '');

		// Verfiy the token and get the userId --- data = token that has the user id
		data = jwt.verify(token, 'secret') as IVerify;

		// Get the user object that matches the ID recived from the verification
		userDocument = await UserDB.findById(data._id, { _id: 0 });

		// Passes the user object for the later adminAuth auth
		req.user = userDocument as IUser;

		if (!userDocument) {
			return next(new HttpError('unable to auth', 401));
		}

		next();
	} catch (e: any) {
		try {
			// User failes auth and now checking for validity of refresh token
			const refreshToken = (req.header('AuthorizationRefresh') as string).replace('Bearer ', '');

			// Checks if there is refreshToken on the headers

			if (refreshToken == null) {
				return next(new HttpError('refresh token not valid, please log in again', 401));
			}

			// Verfiy the token and get the userId --- data = token that has the user id
			data = jwt.verify(refreshToken, 'secret') as IVerify;

			// Get the user object that matches the ID recived from the verification
			const user = await UserDB.findById(data._id, { _id: 0 });

			// Passes the user object for the later adminAuth auth
			req.user = user;

			if (user) {
				const userTokens: string[] = [];

				user.tokens.map((token) => {
					userTokens.push(token.token);
				});

				// Checks if the current refreshToken of the user is included in the 5 latest refreshTokens
				if (!userTokens.includes(refreshToken)) {
					return next(new HttpError('refresh token too old, login again', 401));
				}
			}

			// Gets the id of the verified user inorder to generate new access token
			const verifiedUserId = jwt.verify(refreshToken, 'secret') as IVerify;

			// Generates new access token
			const accessToken = generateAccessToken(verifiedUserId._id);

			// Passes the new token to the req
			req.accessToken = accessToken;

			next();
		} catch (err) {
			return next(
				new HttpError('jwt malformed , please delete all local storage files and login again', 403),
			);
		}
	}
};

const adminAuth: RequestHandler = (req: IAuthMiddlewareRequest, res, next) => {
	const user = req.user as IUser;

	if (user.role !== 'admin') {
		// Checks if the user has admin role
		return next(new HttpError('User is not admin', 401));
	}

	next();
};

// const adminAuth = async (
//   req: IAdminAuthM_iddlewareRequest,
//   res: IAdminAuthM_iddlewareResponse,
//   next: express.NextFunction
// ) => {
//   ServerGlobal.getInstance().logger.info(
//     '[admin auth m_iddleware]: Start processing request'
//   );

//   try {
//     const token = (req.header('Authorization') as string).replace(
//       'Bearer ',
//       ''
//     );

//     const data = jwt.verify(token, process.env.JWT_PWD) as IVerify;

//     const adminDocument: Readonly<
//       Pick<IUserDocument, keyof mongoose.Document | 'email'>
//     > | null = await UserDB.findBy_id(data._id, { email: 1 });

//     if (!adminDocument || adminDocument.email !== process.env.ADMIN_EMAIL) {
//       ServerGlobal.getInstance().logger.error(
//         `[admin auth m_iddleware]: Failed to authenticate administrator for _id: ${data._id}`
//       );

//       res.status(401).send({
//         success: false,
//         message: 'Unable to authenticate',
//       });
//       return;
//     }

//     ServerGlobal.getInstance().logger.info(
//       `[admin auth m_iddleware]: Successfully authenticated administrator with _id ${data._id}`
//     );

//     next();
//   } catch (e) {
//     ServerGlobal.getInstance().logger.error(
//       `[admin auth m_iddleware]: Failed to authenticate administrator because of error: ${e}`
//     );

//     if ((e.message = 'jwt malformed')) {
//       res.status(401).send({
//         success: false,
//         message: 'Unable to authenticate',
//       });
//       return;
//     }

//     res.status(500).send({
//       success: false,
//       message: 'Server error',
//     });
//     return;
//   }
// };

export { auth, adminAuth };
