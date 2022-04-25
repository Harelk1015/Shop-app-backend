import mongoose from 'mongoose';
import { RequestHandler } from 'express';

import { ICart, UserDB } from '../model/user.model';
import HttpError from '../model/http-error';

import {
	IMakeCartMiddlewareRequest,
	IRemoveCartMiddlewareRequest,
	ISetCartMiddlewareRequest,
} from '../model/express/request/cart.request';
import ServerGlobal from '../server-global';

export const addItem: RequestHandler = async (
	req: IMakeCartMiddlewareRequest,
	res,
	next,
) => {
	const { _id, name, price, size, quantity, imageUrl } = req.body;
	const userId = req.user!._id;

	ServerGlobal.getInstance().logger.info('<addItem>: Start processing request');

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			ServerGlobal.getInstance().logger.error(
				`<addItem>: Failed to set cart because user ID ${userId} wasnt found`,
			);

			return next(new HttpError('No user found', 404));
		}

		const existingCartItemIndex = user.cart.findIndex((item) => {
			return (
				item._id.toHexString() === _id.toString() && item.size.toString() === size
			);
		});

		const existingCartItem = user.cart[existingCartItemIndex];

		const mongooseId = new mongoose.Types.ObjectId(_id);

		const cartProduct: ICart = {
			_id: mongooseId,
			name,
			price,
			size,
			quantity,
			imageUrl,
		};

		if (existingCartItem) {
			const updatedItem = existingCartItem;
			updatedItem.quantity += +1;

			user.cart[existingCartItemIndex] = updatedItem;
		} else {
			user.cart.push(cartProduct);
		}

		await user.save();

		ServerGlobal.getInstance().logger.info(
			`<addItem>: Successfully added item with ID ${_id} to user with ID ${userId}`,
		);

		res.status(201).send({
			message: 'Product added to cart successfully',
		});
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<addItem>: Failed to set cart for user ID ${userId} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const setCartItem: RequestHandler = async (
	req: ISetCartMiddlewareRequest,
	res,
	next,
) => {
	const { prodId, quantity } = req.body;
	const userId = req.user!._id;

	ServerGlobal.getInstance().logger.info(
		`<setCartItem>: Start processing request to set quantity item ID ${prodId} for user with ID ${userId}`,
	);

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			ServerGlobal.getInstance().logger.error(
				`<setCartItem>: Failed to set quantity for item ID ${prodId} for user with ID ${userId} because no user found for that id`,
			);

			return next(new HttpError('No user found', 404));
		}

		const existingCartItemIndex = user.cart.findIndex((item) => {
			return item._id.toHexString() === prodId.toString();
		});

		user.cart[existingCartItemIndex].quantity = quantity;

		await user.save();

		ServerGlobal.getInstance().logger.info(
			`<setCartItem>: Successfully set quantity for item ID ${prodId} for user  with ID ${userId}`,
		);

		res.status(202).send({
			message: 'Cart item updated successfully',
		});
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<setCartItem>: Failed to set quantity for item ID ${prodId} for user  with ID ${userId} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const removeCartItem: RequestHandler = async (
	req: IRemoveCartMiddlewareRequest,
	res,
	next,
) => {
	const { _id } = req.body;
	const userId = req.user!._id;

	ServerGlobal.getInstance().logger.info(
		`<removeCartItem>: Start processing request to remove item ID ${_id} for user  with ID ${userId}`,
	);

	try {
		const user = await UserDB.findById(userId);

		if (!user) {
			ServerGlobal.getInstance().logger.error(
				`<removeCartItem>: Failed to remove item ID ${_id} for user with ID ${userId}`,
			);

			return next(new HttpError('No user found', 404));
		}

		const matchedIndex = user.cart.findIndex((item) => {
			return item._id.toHexString() === _id.toString();
		});

		user.cart.splice(matchedIndex, 1);

		await user.save();

		ServerGlobal.getInstance().logger.info(
			`<removeCartItem>: Item ID ${_id} successfully remove from user with id ${userId}`,
		);

		return res.status(200).send({ message: 'item deleted successfully' });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<removeCartItem>: Failed to register because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};
