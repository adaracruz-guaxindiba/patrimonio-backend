import { StatusModel } from '../models/Status';
export const getAllStatuses = async (req, res) => {
    try {
        const statuses = await StatusModel.find().sort({ createdAt: -1 });
        res.json(statuses);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar status' });
    }
};
export const createStatus = async (req, res) => {
    try {
        const { name } = req.body;
        // Verificar se já existe
        const existing = await StatusModel.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        });
        if (existing) {
            return res.status(400).json({ error: 'Status já existe' });
        }
        const status = new StatusModel({
            name: name.trim(),
            isActive: true
        });
        await status.save();
        res.status(201).json(status);
    }
    catch (error) {
        console.error('Erro ao criar status:', error);
        res.status(500).json({ error: 'Erro ao criar status' });
    }
};
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (updates.name) {
            updates.name = updates.name.trim();
            // Verificar se nome já existe (exceto o atual)
            const existing = await StatusModel.findOne({
                name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
                _id: { $ne: id }
            });
            if (existing) {
                return res.status(400).json({ error: 'Nome já existe' });
            }
        }
        const status = await StatusModel.findByIdAndUpdate(id, updates, { new: true });
        if (!status) {
            return res.status(404).json({ error: 'Status não encontrado' });
        }
        res.json(status);
    }
    catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
};
export const deleteStatus = async (req, res) => {
    try {
        const status = await StatusModel.findByIdAndDelete(req.params.id);
        if (!status) {
            return res.status(404).json({ error: 'Status não encontrado' });
        }
        res.json({ message: 'Status deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar status' });
    }
};
export const toggleStatusActive = async (req, res) => {
    try {
        const status = await StatusModel.findById(req.params.id);
        if (!status) {
            return res.status(404).json({ error: 'Status não encontrado' });
        }
        status.isActive = !status.isActive;
        await status.save();
        res.json(status);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao alternar status' });
    }
};
