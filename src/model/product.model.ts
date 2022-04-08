import mongoose from 'mongoose';

interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  category: {
    sex: 'man' | 'woman';
    kind: 'shirt' | 'pants' | 'shoes';
  };
  sizes: number[];
  imageUrl: string;
}

const productSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: { sex: String, kind: String },
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const ProductDB = mongoose.model<IProduct>('Product', productSchema);

export { ProductDB, IProduct };
