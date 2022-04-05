import { RequestHandler } from 'express';
import HttpError from '../model/http-error';
import { IUser } from '../model/user.model';

interface ICreateProductMiddlewareRequest extends Express.Request {
  userId?: string;
  body: any;
  user?: any;
  accessToken? : string
}

export const createProduct: RequestHandler = (
  req: ICreateProductMiddlewareRequest,
  res,
  next
) => {
  const body = req.body;
  const user = req.user as IUser
  const accessToken = req.accessToken


  if (user.role !== 'admin') {
    return next(new HttpError('User is not admin', 401));
  }

  res.status(201).json({ message: body , accessToken});
};

export const getProducts: RequestHandler = (req, res, next) => {};

export const editProduct: RequestHandler = (req, res, next) => {};
