import mongoose, { Schema, Document } from 'mongoose';
import { Loan as LoanInterface } from '../types/index';

export interface LoanDocument extends Omit<LoanInterface, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const LoanSchema = new Schema<LoanDocument>({
  itemId: { type: String, required: true, ref: 'Item' },
  lenderUserId: { type: String, required: true, ref: 'User' },
  borrowerUserId: { type: String, required: true, ref: 'User' },
  statusId: { type: String, required: true, ref: 'Status' },
  loanedAt: { type: String, required: true },
  dueAt: { type: String, required: true },
}, {
  timestamps: true
});

export const LoanModel = mongoose.model<LoanDocument>('Loan', LoanSchema);