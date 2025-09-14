import mongoose, { Schema } from 'mongoose';
const ItemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    sectorId: { type: String, required: true, ref: 'Sector' },
    brandId: { type: String, required: true, ref: 'Brand' },
    statusId: { type: String, required: true, ref: 'Status' },
    acquiredAt: { type: String, required: true },
}, {
    timestamps: true
});
export const ItemModel = mongoose.model('Item', ItemSchema);
