import { RequestHandler } from 'express';

export const createProduct: RequestHandler = (req, res, next) => {
  const body = req.body;
  console.log(body)

  // res.status(201).json({ message: body });
};

export const getProducts: RequestHandler = (req, res, next) => {};

export const editProduct: RequestHandler = (req, res, next) => {};
