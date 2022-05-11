import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserDB, IUser } from '../model/user.model';
import generateAccessToken from '../utils/generateAccessToken';
import HttpError from '../model/http-error';

import {
	IAutoLoginMiddlewareRequest,
	ILoginMiddlewareRequest,
	IRegisterMiddlewareRequest,
} from '../model/express/request/auth.request';
import ServerGlobal from '../server-global';

export const register: RequestHandler = async (
	req: IRegisterMiddlewareRequest,
	res,
	next,
) => {
	ServerGlobal.getInstance().logger.info(
		`<register>: Start processing request with email: ${req.body.email}`,
	);

	// Validate Username
	if (req.body.username.length < 6 || req.body.username.length > 26) {
		ServerGlobal.getInstance().logger.error(
			`<register>: Failed to register since provided invalid username with email ${req.body.email}`,
		);

		return next(new HttpError('username is not valid (atleast 6 charecters)', 400));
	}

	// Validate Email
	const isEmailValid =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
			req.body.email,
		);

	if (!isEmailValid) {
		ServerGlobal.getInstance().logger.error(
			`<register>: Failed to register since provided invalid email ${req.body.email}`,
		);

		return next(new HttpError('email is not valid', 400));
	}

	// Validate password
	if (
		req.body.password.length < 5 ||
		req.body.password.length > 30 ||
		req.body.passwordConfirmation.length < 5 ||
		req.body.passwordConfirmation.length > 30 ||
		req.body.passwordConfirmation !== req.body.password
	) {
		ServerGlobal.getInstance().logger.error(
			`<register>: Failed to register since provided invalid password with email ${req.body.email}`,
		);

		return next(new HttpError('Please provide a valid password (atleast 5 charecters)', 400));
	}

	const [matchingUsername, matchingEmail] = await Promise.all([
		await UserDB.findOne({
			username: req.body.username,
		}),
		await UserDB.findOne({ email: req.body.email }),
	]);

	if (matchingUsername) {
		ServerGlobal.getInstance().logger.error(
			`<register>: Failed to register since provided taken username with email ${req.body.email}`,
		);

		return next(new HttpError('UserName already exists', 400));
	}

	if (matchingEmail) {
		ServerGlobal.getInstance().logger.error(
			`<register>: Failed to register since provided taken email with email ${req.body.email}`,
		);

		return next(new HttpError('E-Mail already exists', 400));
	}

	try {
		// From now on, the client is allowed to register
		const hashedPassword = await bcrypt.hash(req.body.password, 8);

		// create user doc
		const newUser: IUser = new UserDB({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		const newToken = jwt.sign({ id: newUser._id }, process.env.JWT_KEY!, {
			expiresIn: '7 days',
		});

		newUser.tokens = [
			{
				token: newToken,
				_id: new mongoose.Types.ObjectId(),
			},
		];

		await newUser.save();

		ServerGlobal.getInstance().logger.info(
			`<register>: Successfully registered user with ID: ${newUser.id}`,
		);

		res.status(201).send({
			message: 'user created successfuly',
			data: {
				username: req.body.username,
				email: req.body.email,
				token: newToken,
			},
		});
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<register>: Failed to register because of server error: ${err}`,
		);

		return next(new HttpError('server error', 500));
	}
};

export const login: RequestHandler = async (req: ILoginMiddlewareRequest, res, next) => {
	ServerGlobal.getInstance().logger.info(
		`<login>: Start processing request with email: ${req.body.email}`,
	);

	// find email match
	try {
		const userByEmail = await UserDB.findOne({ email: req.body.email });

		if (!userByEmail) {
			ServerGlobal.getInstance().logger.error(
				`<login>: Failed to login because the email ${req.body.email} does not match any user`,
			);

			return next(new HttpError('This email doesnt match any user', 400));
		}

		const compareResults = await bcrypt.compare(
			req.body.password,
			userByEmail.password,
		);

		if (!compareResults) {
			ServerGlobal.getInstance().logger.error(
				`<login>:Failed to login because the password does not match the hashed password \
				with email ${req.body.email}`,
			);

			return next(new HttpError('Passwords doesnt match', 400));
		}

		// Create new token to insert
		const newToken = generateAccessToken(userByEmail._id);
		const refreshToken = jwt.sign({ _id: userByEmail._id }, process.env.JWT_KEY!);

		if (userByEmail.tokens.length === 5) {
			userByEmail.tokens.pop();
		}

		userByEmail.tokens = [
			{
				token: refreshToken,
				_id: new mongoose.Types.ObjectId(),
			},
			...userByEmail.tokens,
		];

		await userByEmail.save();

		ServerGlobal.getInstance().logger.info(
			`<login>:Successfully logged in user in \
			with email ${req.body.email} to user ID: ${userByEmail.id}`,
		);

		// Sends user object without password
		const user = userByEmail;
		req.user = user;
		user.password = '';

		res.status(200).send({
			message: 'logged in successfully',
			data: {
				user,
				accessToken: newToken,
				refreshToken,
			},
		});
		return;
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<login>: Failed to login with email ${req.body.email} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const autoLogin: RequestHandler = async (
	req: IAutoLoginMiddlewareRequest,
	res,
	next,
) => {
	ServerGlobal.getInstance().logger.info(
		`<autoLogin>: Start processing request to auto login user by ID : ${
			req.user!._id
		}`,
	);

	try {
		res.status(200).send({ user: req.user });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<autologin>: Failed to autologin with user ID ${
				req.user!._id
			} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};
