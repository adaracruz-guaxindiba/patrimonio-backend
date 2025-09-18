import mongoose, { Document } from 'mongoose';
import { Item as ItemInterface } from '../types/index.js';
export interface ItemDocument extends Omit<ItemInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const ItemModel: mongoose.Model<ItemDocument, {}, {}, {}, mongoose.Document<unknown, {}, ItemDocument, {}, {}> & ItemDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
