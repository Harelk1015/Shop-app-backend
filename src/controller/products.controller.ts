/* eslint-disable prefer-template */
import { RequestHandler } from 'express';
import HttpError from '../model/http-error';
import { IProduct, ProductDB } from '../model/product.model';

import {
	ICreateProductMiddlewareRequest,
	IGetProductsMiddlewareRequest,
	IGetProductMiddlewareRequest,
} from '../model/express/request/product.request';

export const createProduct: RequestHandler = async (req: ICreateProductMiddlewareRequest, res, next) => {
	try {
		const newProduct: IProduct = new ProductDB({
			name: req.body.name,
			price: req.body.price,
			category: { kind: req.body.category.kind, sex: req.body.category.sex },
			sizes: req.body.sizes,
			imageUrl: req.body.imageUrl,
		});

		newProduct
			.save()
			.then(() => {
				res.status(201).send({ message: newProduct });
			})
			.catch((err) => next(new HttpError(err, 403)));
	} catch (err) {
		return next(new HttpError('Product creation failed', 403));
	}
};

export const getProducts: RequestHandler = async (req: IGetProductsMiddlewareRequest, res, next) => {
	const { sex, kind } = req.body;

	const products: IProduct[] = await ProductDB.find({
		'category.sex': sex,
		'category.kind': kind,
	});

	res.status(200).send({ products });
};

export const getProduct: RequestHandler = async (req: IGetProductMiddlewareRequest, res, next) => {
	const { _id } = req.body;
	try {
		const product = await ProductDB.findOne({
			_id,
		});

		if (!product) {
			return next(new HttpError('product not found', 401));
		}

		res.status(200).send({ product });
	} catch (err) {
		return next(new HttpError('id not found', 404));
	}
};

export const editProduct: RequestHandler = async (req, res, next) => {
	const { _id, prodName, prodPrice, prodSizes } = req.body;

	try {
		const product = await ProductDB.findOne({
			_id,
		});

		if (!product) {
			return next(new HttpError('product not found', 401));
		}

		product.name = prodName;
		product.price = prodPrice;
		product.sizes = prodSizes;

		await product.save();

		res.status(200).send({ message: 'product changed successfuly', _id });
	} catch (err) {
		return next(new HttpError('couldnt edit product', 404));
	}
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
	const { _id } = req.body;

	try {
		// Deletes the product from the shop
		const product = await ProductDB.findByIdAndRemove(_id);

		if (!product) {
			return next(new HttpError('Could not find product and delete', 404));
		}

		// Deletes the product from all user's cart

		// (await UserDB.find()).forEach((user: IUser) => {
		// 	users.push(user);
		// });

		// const asd = await UserDB.find();

		// users.forEach((user) => {
		// 	user.cart.filter((product) => {
		// 		return product._id === _id;
		// 	});
		// });

		// UserDB.

		res.status(202).send({ message: 'product deleted successfully' });
	} catch (err) {
		return next(new HttpError('could not find and delete product', 404));
	}
};
export const navSearch: RequestHandler = async (req, res, next) => {
	const searchInput = req.body.searchInput.trim();

	let searchResults = await ProductDB.find({
		name: { $regex: new RegExp('^' + searchInput + '.*', 'i') },
	}).exec();

	// Returns only 10 items
	searchResults = searchResults.slice(0, 10);

	res.status(200).send({ products: searchResults });
};
