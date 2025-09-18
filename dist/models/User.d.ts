import mongoose, { Document } from 'mongoose';
import { User as UserInterface } from '../types/index.js';
export interface UserDocument extends Omit<UserInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const UserModel: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}, {}> & UserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
