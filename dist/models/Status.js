import mongoose, { Schema } from 'mongoose';
const StatusSchema = new Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});
export const StatusModel = mongoose.model('Status', StatusSchema);
