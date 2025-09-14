import { Request, Response } from 'express';
import { ItemModel } from '../models/Item';
import { SectorModel } from '../models/Sector';
import { BrandModel } from '../models/Brand';
import { StatusModel } from '../models/Status';

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await ItemModel.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, description, sectorId, brandId, statusId, acquiredAt } = req.body;
    
    // Verificar se as referências existem
    const [sector, brand, status] = await Promise.all([
      SectorModel.findById(sectorId),
      BrandModel.findById(brandId),
      StatusModel.findById(statusId)
    ]);
    
    if (!sector) {
      return res.status(400).json({ error: 'Setor não encontrado' });
    }
    if (!brand) {
      return res.status(400).json({ error: 'Marca não encontrada' });
    }
    if (!status) {
      return res.status(400).json({ error: 'Status não encontrado' });
    }
    
    const item = new ItemModel({
      name,
      description,
      sectorId,
      brandId,
      statusId,
      acquiredAt
    });
    
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({ error: 'Erro ao criar item' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    // Verificar referências se estão sendo atualizadas
    if (updates.sectorId) {
      const sector = await SectorModel.findById(updates.sectorId);
      if (!sector) {
        return res.status(400).json({ error: 'Setor não encontrado' });
      }
    }
    
    if (updates.brandId) {
      const brand = await BrandModel.findById(updates.brandId);
      if (!brand) {
        return res.status(400).json({ error: 'Marca não encontrada' });
      }
    }
    
    if (updates.statusId) {
      const status = await StatusModel.findById(updates.statusId);
      if (!status) {
        return res.status(400).json({ error: 'Status não encontrado' });
      }
    }
    
    const item = await ItemModel.findByIdAndUpdate(id, updates, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await ItemModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
};