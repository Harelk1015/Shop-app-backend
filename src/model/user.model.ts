import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  readonly username: string;
  email: string;
  password: string;
  role: string;
  favorites: number[];
  tokens: any[]
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
    },
    tokens: {
      type: [
        {
          token: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const UserDB = mongoose.model<IUser>('User', userSchema);

export { UserDB, IUser };
