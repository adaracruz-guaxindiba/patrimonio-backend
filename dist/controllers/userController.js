import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { transformDocument, transformDocuments } from '../utils/transform.js';
import { emailService } from '../services/emailService.js';
import { tokenService } from '../services/tokenService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().sort({ createdAt: -1 });
        res.json(transformDocuments(users));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};
export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(transformDocument(user));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(transformDocument(user));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};
export const createUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin, isActive, ...otherFields } = req.body;
        // Verificar se email já existe
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já existe' });
        }
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isAdmin: isAdmin || false,
            isActive: isActive !== undefined ? isActive : true,
            ...otherFields
        });
        await user.save();
        res.status(201).json(transformDocument(user));
    }
    catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        // Se está atualizando email, verificar se já existe
        if (updates.email) {
            updates.email = updates.email.toLowerCase();
            const existingUser = await UserModel.findOne({
                email: updates.email,
                _id: { $ne: id }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email já existe' });
            }
        }
        // Se está atualizando senha, fazer hash
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(transformDocument(user));
    }
    catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Buscar usuário
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        // Verificar se está ativo
        if (!user.isActive) {
            return res.status(401).json({ error: 'Usuário inativo' });
        }
        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        // Gerar token
        const token = jwt.sign({ userId: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: transformDocument(user), token });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no login' });
    }
};
// Solicitar recuperação de senha
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }
        // Buscar usuário
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Por segurança, sempre retornar sucesso mesmo se usuário não existir
            return res.json({ message: 'Se o email existir, você receberá instruções para recuperação' });
        }
        // Verificar se está ativo
        if (!user.isActive) {
            return res.json({ message: 'Se o email existir, você receberá instruções para recuperação' });
        }
        // Gerar token de recuperação
        const resetToken = tokenService.generateResetToken(user._id.toString(), user.email);
        // Salvar token no banco
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
        await user.save();
        // Enviar email
        const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken, user.name);
        if (!emailSent) {
            console.error('Falha ao enviar email de recuperação para:', user.email);
        }
        res.json({ message: 'Se o email existir, você receberá instruções para recuperação' });
    }
    catch (error) {
        console.error('Erro ao solicitar recuperação de senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Redefinir senha com token
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        }
        // Validar token
        const tokenData = tokenService.validateResetToken(token);
        if (!tokenData) {
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }
        // Buscar usuário
        const user = await UserModel.findOne({
            _id: tokenData.userId,
            email: tokenData.email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }
        // Atualizar senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.lastPasswordReset = new Date();
        user.isTemporaryPassword = false;
        await user.save();
        console.log(`🔐 Senha redefinida para usuário: ${user.email}`);
        res.json({ message: 'Senha redefinida com sucesso' });
    }
    catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Criar usuário com senha temporária (para admins)
export const createUserWithTempPassword = async (req, res) => {
    try {
        const { name, email, isAdmin, isActive, ...otherFields } = req.body;
        // Verificar se email já existe
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já existe' });
        }
        // Gerar senha temporária
        const tempPassword = tokenService.generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const user = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isAdmin: isAdmin || false,
            isActive: isActive !== undefined ? isActive : true,
            isTemporaryPassword: true,
            ...otherFields
        });
        await user.save();
        // Enviar email de boas-vindas
        const emailSent = await emailService.sendWelcomeEmail(user.email, user.name, tempPassword);
        if (!emailSent) {
            console.error('Falha ao enviar email de boas-vindas para:', user.email);
        }
        console.log(`👤 Usuário criado com senha temporária: ${user.email}`);
        res.status(201).json({
            user: transformDocument(user),
            tempPassword: emailSent ? undefined : tempPassword // Só retornar se email falhou
        });
    }
    catch (error) {
        console.error('Erro ao criar usuário com senha temporária:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};
// Alterar senha (usuário logado)
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
        }
        // Buscar usuário
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        // Verificar senha atual
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Senha atual incorreta' });
        }
        // Atualizar senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.lastPasswordReset = new Date();
        user.isTemporaryPassword = false;
        await user.save();
        console.log(`🔐 Senha alterada para usuário: ${user.email}`);
        res.json({ message: 'Senha alterada com sucesso' });
    }
    catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
