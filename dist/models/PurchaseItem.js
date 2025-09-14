import mongoose, { Schema } from 'mongoose';
const PurchaseItemSchema = new Schema({
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
export const PurchaseItemModel = mongoose.model('PurchaseItem', PurchaseItemSchema);
