import mongoose, { Document } from 'mongoose';
import { Brand as BrandInterface } from '../types/index.js';
export interface BrandDocument extends Omit<BrandInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const BrandModel: mongoose.Model<BrandDocument, {}, {}, {}, mongoose.Document<unknown, {}, BrandDocument, {}, {}> & BrandDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
