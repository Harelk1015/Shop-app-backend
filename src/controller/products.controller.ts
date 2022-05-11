/* eslint-disable prefer-template */
import { RequestHandler } from 'express';

import HttpError from '../model/http-error';
import { IProduct, ProductDB } from '../model/product.model';

import {
	ICreateProductMiddlewareRequest,
	IGetProductsMiddlewareRequest,
	IGetProductMiddlewareRequest,
	IEditProductMiddlewareRequest,
	IDeleteProductMiddlewareRequest,
	INavSearchProductMiddlewareRequest,
} from '../model/express/request/product.request';
import ServerGlobal from '../server-global';

export const createProduct: RequestHandler = async (
	req: ICreateProductMiddlewareRequest,
	res,
	next,
) => {
	const userId = req.user!._id;

	ServerGlobal.getInstance().logger.info(
		`<createProduct>: Start processing request from user with id ${userId} to create product`,
	);

	try {
		const newProduct: IProduct = new ProductDB({
			name: req.body.name,
			price: req.body.price,
			category: { kind: req.body.category.kind, sex: req.body.category.sex },
			sizes: req.body.sizes,
			imageUrl: req.body.imageUrl,
		});

		await newProduct.save();

		ServerGlobal.getInstance().logger.info(
			`<createProduct>: Product ${req.body.name} created successfully by user with ID ${userId}`,
		);

		res.status(201).send({ newProduct });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<createProduct>: Product creation by user with ID ${userId} failed because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const getProducts: RequestHandler = async (
	req: IGetProductsMiddlewareRequest,
	res,
	next,
) => {
	const { sex, kind } = req.body;
	let products: IProduct[] = [];

	ServerGlobal.getInstance().logger.info(
		`<getProducts>: Start processing request get products by categoeries : ${sex} and ${kind}`,
	);

	try {
		if (sex && !kind) {
			products = await ProductDB.find({
				'category.sex': sex,
			});
		}

		if (kind && !sex) {
			products = await ProductDB.find({
				'category.kind': kind,
			});
		}

		if (sex && kind) {
			products = await ProductDB.find({
				'category.sex': sex,
				'category.kind': kind ? kind : '',
			});
		}

		ServerGlobal.getInstance().logger.info(
			`<getProducts>: Successfully fetched products by categoeries : ${sex} and ${kind}`,
		);

		res.status(200).send({ products });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<getProducts>: Failed to get products because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const getProduct: RequestHandler = async (
	req: IGetProductMiddlewareRequest,
	res,
	next,
) => {
	const { _id } = req.body;

	ServerGlobal.getInstance().logger.info(
		`<getProduct>: Start processing request to get item by ID ${_id}`,
	);

	try {
		const product = await ProductDB.findOne({
			_id,
		});

		if (!product) {
			ServerGlobal.getInstance().logger.error(
				`<getProduct>: Product with ID ${_id} was not found`,
			);

			return next(new HttpError('product not found', 401));
		}

		ServerGlobal.getInstance().logger.info(
			`<getProduct>: Successfully fetched item by ID ${_id}`,
		);

		res.status(200).send({ product });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<getProduct>: Failed to fetch item by ID ${_id} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const editProduct: RequestHandler = async (
	req: IEditProductMiddlewareRequest,
	res,
	next,
) => {
	const { _id, prodName, prodPrice, prodSizes } = req.body;

	ServerGlobal.getInstance().logger.info(
		`<editProduct>: Request to edit product with ID ${_id} has started`,
	);

	if (!_id) {
		ServerGlobal.getInstance().logger.error(
			`<editProduct>: Failed to edit product because product with ID ${_id} was not found`,
		);

		return next(new HttpError('product not found', 401));
	}

	try {
		const product = await ProductDB.findOne({
			_id,
		});

		if (!product) {
			ServerGlobal.getInstance().logger.error(
				`<editProduct>: Failed to edit product because product with ID ${_id} was not found`,
			);

			return next(new HttpError('product not found', 401));
		}

		product.name = prodName;
		product.price = prodPrice;
		product.sizes = prodSizes;

		await product.save();

		ServerGlobal.getInstance().logger.info(
			`<editProduct>: Successfully edited item with ID ${_id}`,
		);

		res.status(200).send({ message: 'product changed successfuly', _id });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<editProduct>: Failed to edit product with ID ${_id} because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};

export const deleteProduct: RequestHandler = async (
	req: IDeleteProductMiddlewareRequest,
	res,
	next,
) => {
	const { _id } = req.body;

	ServerGlobal.getInstance().logger.info(
		`<deleteProduct>: Start processing request to remove item ID ${_id} from the shop`,
	);

	try {
		// Deletes the product from the shop
		const product = await ProductDB.findByIdAndRemove(_id);

		if (!product) {
			ServerGlobal.getInstance().logger.error(
				`<deleteProduct>: Failed to remove item ID ${_id} from the shop because it was not found`,
			);

			return next(new HttpError('Could not find product and delete', 404));
		}

		ServerGlobal.getInstance().logger.info(
			`<deleteProduct>: Sucessfully removed item ID ${_id} from the shop`,
		);

		res.status(202).send({ message: 'product deleted successfully' });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<deleteProduct>: Failed to register because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};
export const navSearch: RequestHandler = async (
	req: INavSearchProductMiddlewareRequest,
	res,
	next,
) => {
	const searchInput = req.body.searchInput.trim();

	ServerGlobal.getInstance().logger.info(
		`<searchInput>: Start processing request to find product by the text : "${searchInput}"`,
	);

	try {
		let searchResults = await ProductDB.find({
			name: { $regex: new RegExp('^' + searchInput + '.*', 'i') },
		}).exec();

		// Returns only 10 items
		searchResults = searchResults.slice(0, 10);

		res.status(200).send({ products: searchResults });
	} catch (err) {
		ServerGlobal.getInstance().logger.error(
			`<searchInput>: Failed to find item by the text : "${searchInput}" because of server error: ${err}`,
		);

		return next(new HttpError('Server error', 500));
	}
};
