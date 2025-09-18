import { SectorModel } from '../models/Sector.js';
import { transformDocument, transformDocuments } from '../utils/transform.js';
export const getAllSectors = async (req, res) => {
    try {
        const sectors = await SectorModel.find().sort({ createdAt: -1 });
        res.json(transformDocuments(sectors));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar setores' });
    }
};
export const createSector = async (req, res) => {
    try {
        const { name } = req.body;
        // Verificar se já existe
        const existing = await SectorModel.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        });
        if (existing) {
            return res.status(400).json({ error: 'Setor já existe' });
        }
        const sector = new SectorModel({
            name: name.trim(),
            isActive: true
        });
        await sector.save();
        res.status(201).json(transformDocument(sector));
    }
    catch (error) {
        console.error('Erro ao criar setor:', error);
        res.status(500).json({ error: 'Erro ao criar setor' });
    }
};
export const updateSector = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (updates.name) {
            updates.name = updates.name.trim();
            // Verificar se nome já existe (exceto o atual)
            const existing = await SectorModel.findOne({
                name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
                _id: { $ne: id }
            });
            if (existing) {
                return res.status(400).json({ error: 'Nome já existe' });
            }
        }
        const sector = await SectorModel.findByIdAndUpdate(id, updates, { new: true });
        if (!sector) {
            return res.status(404).json({ error: 'Setor não encontrado' });
        }
        res.json(transformDocument(sector));
    }
    catch (error) {
        console.error('Erro ao atualizar setor:', error);
        res.status(500).json({ error: 'Erro ao atualizar setor' });
    }
};
export const deleteSector = async (req, res) => {
    try {
        const sector = await SectorModel.findByIdAndDelete(req.params.id);
        if (!sector) {
            return res.status(404).json({ error: 'Setor não encontrado' });
        }
        res.json({ message: 'Setor deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar setor' });
    }
};
export const toggleSectorActive = async (req, res) => {
    try {
        const sector = await SectorModel.findById(req.params.id);
        if (!sector) {
            return res.status(404).json({ error: 'Setor não encontrado' });
        }
        sector.isActive = !sector.isActive;
        await sector.save();
        res.json(transformDocument(sector));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao alternar status do setor' });
    }
};
