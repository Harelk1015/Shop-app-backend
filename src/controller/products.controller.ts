import { RequestHandler } from 'express';
import HttpError from '../model/http-error';
import { IProduct, ProductDB } from '../model/product.model';

import {
  ICreateProductMiddlewareRequest,
  IGetProductsMiddlewareRequest,
  IGetProductMiddlewareRequest,
} from '../model/express/request/product.response';

export const createProduct: RequestHandler = async (
  req: ICreateProductMiddlewareRequest,
  res,
  next
) => {
  const body = req.body;

  try {
    const newProduct: IProduct = new ProductDB({
      name: req.body.name,
      price: req.body.price,
      category: { kind: req.body.category.kind, sex: req.body.category.sex },
      sizes: req.body.sizes,
      imageUrl: req.body.imageUrl,
    });

    await newProduct
      .save()
      .then((respose) => {
        res.status(201).json({ message: newProduct });
      })
      .catch(() => {
        return next(new HttpError('Product creation failed', 401));
      });
  } catch (err) {
    return next(new HttpError('Product creation failed', 401));
  }
};

export const getProducts: RequestHandler = async (
  req: IGetProductsMiddlewareRequest,
  res,
  next
) => {
  const sex = req.body.sex;
  const kind = req.body.kind;

  const products: IProduct[] = await ProductDB.find({
    'category.sex': sex,
    'category.kind': kind,
  });

  res.status(200).json({ products });
};

export const getProduct: RequestHandler = async (
  req: IGetProductMiddlewareRequest,
  res,
  next
) => {
  const _id = req.body._id;

  const product = await ProductDB.findOne({
    _id,
  });

  res.status(200).json({ product });
};

export const editProduct: RequestHandler = (req, res, next) => {};
