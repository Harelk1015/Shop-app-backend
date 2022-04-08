import { Express } from 'express';
import mongoose from 'mongoose';

export interface ICreateProductMiddlewareRequest extends Express.Request {
  body: {
    name: string;
    price: number;
    category: { sex: string; kind: string };
    sizes: [string];
    imageUrl: string;
  };
}

export interface IGetProductsMiddlewareRequest extends Express.Request {
  body: {
    sex: string;
    kind: string;
  };
}

export interface IGetProductMiddlewareRequest extends Express.Request {
  body: {
    _id: mongoose.Types.ObjectId;
  };
}
