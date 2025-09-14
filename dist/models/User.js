import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    cep: { type: String },
    city: { type: String },
    state: { type: String },
    street: { type: String },
    neighborhood: { type: String },
    phone: { type: String },
    // Campos para recuperação de senha
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastPasswordReset: { type: Date },
    // Campo para controle de senha temporária
    isTemporaryPassword: { type: Boolean, default: false },
}, {
    timestamps: true
});
export const UserModel = mongoose.model('User', UserSchema);
