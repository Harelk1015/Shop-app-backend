/* eslint-disable no-unused-expressions */
import mongoose from 'mongoose';
import { IProduct } from './product.model';

interface Token {
	token: string;
	_id: mongoose.Types.ObjectId;
}

export interface ICart {
	parentId: mongoose.Types.ObjectId;
	_id: mongoose.Types.ObjectId;
	name: string;
	price: number;
	size: number;
	quantity: number;
	imageUrl: string;
}

interface IUser extends mongoose.Document {
	readonly username: string;
	email: string;
	password: string;
	role: string;
	favorites: number[];
	tokens: Token[];
	cart: ICart[];
}

const userSchema: mongoose.Schema = new mongoose.Schema(
	{
		username: {
			type: String,
			minlength: 3,
			maxlength: 26,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			maxlength: 30,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			required: true,
		},
		favorites: {
			type: [],
			required: true,
			ref: 'Product',
			default: [],
		},
		tokens: {
			type: [
				{
					token: { type: String },
				},
			],
			default: [],
		},
		cart: {
			type: [
				{
					_id: mongoose.Types.ObjectId,
					parentId: mongoose.Types.ObjectId,
					name: String,
					price: Number,
					size: Number,
					quantity: Number,
					imageUrl: String,
				},
			],
			default: [],
		},
	},
	{ timestamps: true },
);

const UserDB = mongoose.model<IUser>('User', userSchema);

export { UserDB, IUser };
