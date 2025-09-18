import { Request, Response } from 'express';
import { BrandModel } from '../models/Brand.js';

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await BrandModel.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar marcas' });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    // Verificar se já existe
    const existing = await BrandModel.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    if (existing) {
      return res.status(400).json({ error: 'Marca já existe' });
    }
    
    const brand = new BrandModel({
      name: name.trim(),
      isActive: true
    });
    
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    console.error('Erro ao criar marca:', error);
    res.status(500).json({ error: 'Erro ao criar marca' });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (updates.name) {
      updates.name = updates.name.trim();
      // Verificar se nome já existe (exceto o atual)
      const existing = await BrandModel.findOne({
        name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({ error: 'Nome já existe' });
      }
    }
    
    const brand = await BrandModel.findByIdAndUpdate(id, updates, { new: true });
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }
    
    res.json(brand);
  } catch (error) {
    console.error('Erro ao atualizar marca:', error);
    res.status(500).json({ error: 'Erro ao atualizar marca' });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await BrandModel.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }
    res.json({ message: 'Marca deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar marca' });
  }
};

export const toggleBrandActive = async (req: Request, res: Response) => {
  try {
    const brand = await BrandModel.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }
    
    brand.isActive = !brand.isActive;
    await brand.save();
    
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alternar status da marca' });
  }
};