import mongoose, { Schema } from 'mongoose';
const LoanSchema = new Schema({
    itemId: { type: String, required: true, ref: 'Item' },
    lenderUserId: { type: String, required: true, ref: 'User' },
    borrowerUserId: { type: String, required: true, ref: 'User' },
    statusId: { type: String, required: true, ref: 'Status' },
    loanedAt: { type: String, required: true },
    dueAt: { type: String, required: true },
}, {
    timestamps: true
});
export const LoanModel = mongoose.model('Loan', LoanSchema);
