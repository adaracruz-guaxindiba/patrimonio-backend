import mongoose, { Document } from 'mongoose';
import { StatusItem as StatusInterface } from '../types/index.js';
export interface StatusDocument extends Omit<StatusInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const StatusModel: mongoose.Model<StatusDocument, {}, {}, {}, mongoose.Document<unknown, {}, StatusDocument, {}, {}> & StatusDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
