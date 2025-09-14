import mongoose, { Schema, Document } from 'mongoose';
import { Brand as BrandInterface } from '../types/index';

export interface BrandDocument extends Omit<BrandInterface, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const BrandSchema = new Schema<BrandDocument>({
  name: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const BrandModel = mongoose.model<BrandDocument>('Brand', BrandSchema);