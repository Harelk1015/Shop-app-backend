import express, { Request, Response, NextFunction } from 'express';
import './db/mongoose';
import cors from 'cors';
import HttpError from './model/http-error';

import authRoutes from './routes/auth.router';
import productRouter from './routes/product.router';
import userRouter from './routes/user.router';
import ticketRouter from './routes/ticket.router';
import cartRouter from './routes/cart.router';

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoutes);
app.use('/products', productRouter);
app.use('/user', userRouter);
app.use('/ticket', ticketRouter);
app.use('/cart', cartRouter);

// eslint-disable-next-line no-unused-vars
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

app.listen(process.env.PORT || 3030, () => {
	console.log('server is running');
});
