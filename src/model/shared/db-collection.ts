import mongoose from 'mongoose';

export interface IDBCollection {
    readonly _id: mongoose.Types.ObjectId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

