import mongoose, { Document } from 'mongoose';
import { Sector as SectorInterface } from '../types/index';
export interface SectorDocument extends Omit<SectorInterface, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}
export declare const SectorModel: mongoose.Model<SectorDocument, {}, {}, {}, mongoose.Document<unknown, {}, SectorDocument, {}, {}> & SectorDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
