/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/prefer-default-export */
import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ICartMiddlewareRequest } from '../model/express/request/cart.request';
import HttpError from '../model/http-error';
import { ICart, UserDB } from '../model/user.model';

export const makeCart: RequestHandler = async (req: ICartMiddlewareRequest, res, next) => {
	const { _id, name, price, size, quantity, imageUrl } = req.body;
	const userId = req?.user?._id;

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			return next(new HttpError('No user found', 404));
		}

		const cartProduct: ICart = {
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
