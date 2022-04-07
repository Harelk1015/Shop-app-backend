import express, { Request, Response, NextFunction, response } from 'express';

import './db/mongoose';
import HttpError from './model/http-error';

import authRoutes from './routes/auth.router';
import productRouter from './routes/product.router';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  //Enabling CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret,Authorization ,AuthorizationRefresh, user'
  );
  next();
});

('Authorization ,AuthorizationRefresh, user');

app.use('/auth', authRoutes);
app.use('/products', productRouter);

app.use((req, res, next) => {
  throw new HttpError('couldnt find this route', 404);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'an unknown error occurred' });
});

('mongodb+srv://user:ySuVZNb4Jq90JRg3@cluster0.1szjm.mongodb.net/shopApp');

app.listen(3030, () => {
  console.log('server is running');
});
