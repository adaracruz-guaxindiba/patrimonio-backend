import mongoose, { Document } from 'mongoose';
import { Loan as LoanInterface } from '../types/index.js';
export interface LoanDocument extends Omit<LoanInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const LoanModel: mongoose.Model<LoanDocument, {}, {}, {}, mongoose.Document<unknown, {}, LoanDocument, {}, {}> & LoanDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
