import mongoose, { Document } from 'mongoose';
import { PurchaseItem as PurchaseItemInterface } from '../types/index';
export interface PurchaseItemDocument extends Omit<PurchaseItemInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const PurchaseItemModel: mongoose.Model<PurchaseItemDocument, {}, {}, {}, mongoose.Document<unknown, {}, PurchaseItemDocument, {}, {}> & PurchaseItemDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
