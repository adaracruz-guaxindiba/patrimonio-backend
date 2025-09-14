import mongoose, { Schema } from 'mongoose';
const BrandSchema = new Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});
export const BrandModel = mongoose.model('Brand', BrandSchema);
