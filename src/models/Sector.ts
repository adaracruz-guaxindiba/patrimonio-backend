import mongoose, { Schema, Document } from 'mongoose';
import { Sector as SectorInterface } from '../types/index.js';

export interface SectorDocument extends Omit<SectorInterface, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const SectorSchema = new Schema<SectorDocument>({
  name: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const SectorModel = mongoose.model<SectorDocument>('Sector', SectorSchema);