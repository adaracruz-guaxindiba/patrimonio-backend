import mongoose, { Schema, Document } from 'mongoose';
import { StatusItem as StatusInterface } from '../types/index';  

export interface StatusDocument extends Omit<StatusInterface, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const StatusSchema = new Schema<StatusDocument>({
  name: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const StatusModel = mongoose.model<StatusDocument>('Status', StatusSchema);