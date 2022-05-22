/* eslint-disable no-unsafe-optional-chaining */
import { RequestHandler } from 'express';

import bcrypt from 'bcrypt';

import { UserDB } from '../model/user.model';
import HttpError from '../model/http-error';

import {
	IAddFavoritedMiddlewareRequest,
	IChangePasswordMiddlewareRequest,
	IGetFavoritesMiddlewareRequest,
	IRemoveFavoritedMiddlewareRequest,
} from '../model/express/request/user.request';
import ServiceGlobal from '../service-global';

export const changePassowrd: RequestHandler = async (
	req: IChangePasswordMiddlewareRequest,
	res,
	next,
) => {
	const userId = req.user!._id;
	const { oldPassword, newPassword } = req.body;

	ServiceGlobal.getInstance().logger.info(
		`<changePassowrd>: Start processing request to change password for user with ID ${userId}`,
	);

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			ServiceGlobal.getInstance().logger.error(
				`<changePassowrd>: Failed to change password for user with ID ${userId} because there is not user with that ID`,
			);

			return next(new HttpError('cant find user', 403));
		}

		if (!oldPassword) {
			ServiceGlobal.getInstance().logger.error(
				`<changePassowrd>: Failed to change password for user with ID ${userId} because the provided password does not match the user's password`,
			);

			return next(new HttpError('old password does not match', 403));
		}

		if (!newPassword || newPassword.length < 5 || newPassword.length > 30) {
			ServiceGlobal.getInstance().logger.error(
				`<changePassowrd>: Failed to change password for user with ID ${userId} because the provided password doesnt match the requirements`,
			);

			return next(new HttpError('Please enter a valid password', 403));
		}

		const compareResults = await bcrypt.compare(oldPassword, user.password);

		if (!compareResults) {
			ServiceGlobal.getInstance().logger.error(
				`<changePassowrd>: Failed to change password for user with ID ${userId} because the entered password doesnt match the user's password `,
			);

			return next(new HttpError('password doesnt match', 400));
		}

		// from now on the client passwords are verified
		const hashedPassword = await bcrypt.hash(newPassword, 8);

		user.password = hashedPassword;

		await user.save();

		ServiceGlobal.getInstance().logger.info(
			`<changePassowrd>: Successfully changed password for user with ID ${userId}`,
		);

		res.status(200).send({ message: 'password changed successfully' });
	} catch (err) {
		ServiceGlobal.getInstance().logger.error(
			`<changePassowrd>: Failed to change password for user with ID ${userId} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const addFavorite: RequestHandler = async (
	req: IAddFavoritedMiddlewareRequest,
	res,
	next,
) => {
	const { productId } = req.body;
	const userId = req.user!._id;

	ServiceGlobal.getInstance().logger.info(
		`<addFavorite>: Start processing request to add favorite item ID ${productId} for user with ID ${userId}`,
	);

	const user = await UserDB.findByIdAndUpdate(userId, {
		$push: { favorites: productId },
	});

	if (!user) {
		ServiceGlobal.getInstance().logger.error(
			`<addFavorite>: Failed to to add favorite item ID ${productId} for user with ID ${userId} because user was not found`,
		);

		return next(new HttpError('Could not add favorite , please try to login', 403));
	}

	ServiceGlobal.getInstance().logger.info(
		`<addFavorite>: Successfuly added favorite item ID ${productId} for user with ID ${userId}`,
	);

	res.status(201).send({ message: 'Favorite added succcessffuly' });
};

export const removeFavorite: RequestHandler = async (
	req: IRemoveFavoritedMiddlewareRequest,
	res,
	next,
) => {
	const { productId } = req.body;
	const userId = req.user!._id;

	ServiceGlobal.getInstance().logger.info(
		`<removeFavorite>: Start processing request to remove favorite item ID ${productId} for user with ID ${userId}`,
	);

	try {
		if (!productId || !userId) {
			ServiceGlobal.getInstance().logger.error(
				`<removeFavorite>: Failed to remove favorite item ID ${productId} for user with ID ${userId} because the client didnt provide product and user ID`,
			);

			return next(new HttpError('Could not remove favorite', 401));
		}

		const user = await UserDB.findByIdAndUpdate(userId, {
			$pull: { favorites: productId },
		});

		if (!user) {
			ServiceGlobal.getInstance().logger.error(
				`<removeFavorite>: Failed to remove favorite item ID ${productId} for user with ID ${userId} because user was not found`,
			);

			return next(
				new HttpError('Could not remove favorite , please try again', 403),
			);
		}

		ServiceGlobal.getInstance().logger.info(
			`<removeFavorite>: Successfuly removed item ID ${productId} for user with ID ${userId}`,
		);

		res.status(201).send({ message: 'Favorite removed succcessffuly' });
	} catch (err) {
		ServiceGlobal.getInstance().logger.error(
			`<removeFavorite>: Failed to remove item ID ${productId} for user with ID ${userId} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const getFavorites: RequestHandler = async (
	req: IGetFavoritesMiddlewareRequest,
	res,
	next,
) => {
	const userId = req.user!._id;

	ServiceGlobal.getInstance().logger.info(
		`<getFavorites>: Start processing request get favorites for user with ID ${userId}`,
	);

	try {
		const user = await UserDB.findById(userId, {
			favorites: 1,
		}).populate('favorites', '_id name imageUrl');

		if (!user) {
			ServiceGlobal.getInstance().logger.error(
				`<getFavorites>: Failed to get favorites for user with ID ${userId} because the user was not found`,
			);

			return next(new HttpError('No user found, please try again', 403));
		}

		const userFavorites = user.favorites;

		ServiceGlobal.getInstance().logger.info(
			`<getFavorites>: Successfully fetched favorites for user with ID ${userId}`,
		);

		res.status(200).send({ userFavorites });
	} catch (err) {
		return next(new HttpError('Server error', 500));
	}
};
