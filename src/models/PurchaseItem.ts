import mongoose, { Schema, Document } from 'mongoose';
import { PurchaseItem as PurchaseItemInterface } from '../types/index';

export interface PurchaseItemDocument extends Omit<PurchaseItemInterface, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const PurchaseItemSchema = new Schema<PurchaseItemDocument>({
  itemName: { type: String, required: true },
  existingItemId: { type: String, ref: 'Item' },
  quantity: { type: Number, required: true, default: 1 },
  justification: { type: String, required: true },
  priority: { 
    type: String, 
    required: true, 
    enum: ['baixa', 'média', 'alta', 'urgente'],
    default: 'média'
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pendente', 'aprovado', 'rejeitado', 'comprado'],
    default: 'pendente'
  },
  requestedBy: { type: String, required: true, ref: 'User' },
}, {
  timestamps: true
});

export const PurchaseItemModel = mongoose.model<PurchaseItemDocument>('PurchaseItem', PurchaseItemSchema);