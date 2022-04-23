/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ICartMiddlewareRequest } from '../model/express/request/cart.request';
import HttpError from '../model/http-error';
import { ICart, IUser, UserDB } from '../model/user.model';

export const makeCart: RequestHandler = async (req: ICartMiddlewareRequest, res, next) => {
	const { _id, name, price, size, quantity, imageUrl, parentId } = req.body;
	const userId = req?.user?._id;

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			return next(new HttpError('No user found', 404));
		}

		const cartProduct: ICart = {
			parentId,
			_id,
			name,
			price,
			size,
			quantity,
			imageUrl,
		};

		const existingCartItemIndex = user.cart.findIndex((item) => {
			return item._id.toHexString() === _id;
		});

		// const existingCartItem = user.cart.map((item) => {
		// 	if (item.parentId === _id && item.size === size) {
		// 	}
		// });

		const existingCartItem = user.cart[existingCartItemIndex];

		if (existingCartItem) {
			const updatedItem = existingCartItem;
			updatedItem.quantity += +1;

			user.cart[existingCartItemIndex] = updatedItem;
		} else {
			user.cart.push(cartProduct);
		}

		await user.save();

		res.status(201).json({ message: 'Product added to cart successfully' });
	} catch (err) {
		return next(new HttpError('cart creation failed', 403));
	}
};

export const setCartItem: RequestHandler = async (req: ICartMiddlewareRequest, res, next) => {
	const { prodId, quantity } = req.body;
	const userId = req?.user?._id;

	const user = await UserDB.findById(userId);

	if (!user) {
		return next(new HttpError('No user found', 404));
	}

	const matchedIndex = user.cart.findIndex((item) => {
		return item._id.toHexString() === prodId;
	});

	user.cart[matchedIndex].quantity = quantity;

	res.status(202).json({ message: 'Cart item updated successfully' });

	await user.save();
};

export const removeCartItem: RequestHandler = async (req: ICartMiddlewareRequest, res, next) => {
	const { _id } = req.body;
	const userId = req?.user?._id;

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			return next(new HttpError('No user found', 404));
		}

		const matchedIndex = user.cart.findIndex((item) => {
			return item._id.toHexString() === _id;
		});

		user.cart.splice(matchedIndex, 1);

		await user.save();

		return res.status(200).json({ message: 'item deleted successfully' });
	} catch (err: any) {
		return next(new HttpError(err.response, 403));
	}
};
