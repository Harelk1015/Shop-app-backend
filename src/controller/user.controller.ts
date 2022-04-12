/* eslint-disable no-unsafe-optional-chaining */
import { RequestHandler } from 'express';
import { IUserMiddlewareRequest } from '../model/express/request/user.request';
import HttpError from '../model/http-error';
import { UserDB } from '../model/user.model';

// eslint-disable-next-line import/prefer-default-export
export const addFavorite: RequestHandler = async (req: IUserMiddlewareRequest, res, next) => {
	const { productId } = req.body;
	const userId = req?.user?._id;

	const user = await UserDB.findByIdAndUpdate(userId, { $push: { favorites: productId } });

	if (!user) {
		return next(new HttpError('Could not add favorite , please try to login', 403));
	}

	res.status(201).json({ message: 'Favorite added succcessffuly' });
};

export const removeFavorite: RequestHandler = async (req: IUserMiddlewareRequest, res, next) => {
	const { productId } = req.body;
	const userId = req?.user?._id;
	if (!productId || !userId) {
		return next(new HttpError('Could not remove favorite', 401));
	}
	// const userId = req?.user?._id;

	const user = await UserDB.findByIdAndUpdate(userId, { $pull: { favorites: productId } });

	if (!user) {
		return next(new HttpError('Could not remove favorite , please try again', 403));
	}

	res.status(201).json({ message: 'Favorite removed succcessffuly' });
};

export const getFavorites: RequestHandler = async (req: IUserMiddlewareRequest, res, next) => {
	const userId = req?.user?._id;

	const user = await UserDB.findById(userId, {
		favorites: 1,
	}).populate('favorites', '_id name imageUrl');

	if (!user) {
		return next(new HttpError('No user found, please try again', 403));
	}

	const userFavorites = user.favorites;

	res.status(200).json({ userFavorites });
};
