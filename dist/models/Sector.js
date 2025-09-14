import mongoose, { Schema } from 'mongoose';
const SectorSchema = new Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});
export const SectorModel = mongoose.model('Sector', SectorSchema);
