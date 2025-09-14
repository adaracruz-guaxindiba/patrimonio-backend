import mongoose, { Schema, Document } from 'mongoose';
import { Item as ItemInterface } from '../types/index';

export interface ItemDocument extends Omit<ItemInterface, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ItemSchema = new Schema<ItemDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  sectorId: { type: String, required: true, ref: 'Sector' },
  brandId: { type: String, required: true, ref: 'Brand' },
  statusId: { type: String, required: true, ref: 'Status' },
  acquiredAt: { type: String, required: true },
}, {
  timestamps: true
});

export const ItemModel = mongoose.model<ItemDocument>('Item', ItemSchema);