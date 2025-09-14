import { PurchaseItemModel } from '../models/PurchaseItem';
import { ItemModel } from '../models/Item';
import { UserModel } from '../models/User';
import { transformDocument, transformDocuments } from '../utils/transform';
export const getAllPurchaseItems = async (req, res) => {
    try {
        const purchaseItems = await PurchaseItemModel.find().sort({ createdAt: -1 });
        res.json(transformDocuments(purchaseItems));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar itens de compra' });
    }
};
export const createPurchaseItem = async (req, res) => {
    try {
        const { itemName, existingItemId, quantity, justification, priority, status, requestedBy } = req.body;
        // Verificar se o usuário existe
        const user = await UserModel.findById(requestedBy);
        if (!user) {
            return res.status(400).json({ error: 'Usuário solicitante não encontrado' });
        }
        // Verificar se o item existente existe (se fornecido)
        if (existingItemId) {
            const item = await ItemModel.findById(existingItemId);
            if (!item) {
                return res.status(400).json({ error: 'Item existente não encontrado' });
            }
        }
        const purchaseItem = new PurchaseItemModel({
            itemName,
            existingItemId,
            quantity: quantity || 1,
            justification,
            priority: priority || 'média',
            status: status || 'pendente',
            requestedBy
        });
        await purchaseItem.save();
        res.status(201).json(transformDocument(purchaseItem));
    }
    catch (error) {
        console.error('Erro ao criar item de compra:', error);
        res.status(500).json({ error: 'Erro ao criar item de compra' });
    }
};
export const updatePurchaseItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        // Verificar referências se estão sendo atualizadas
        if (updates.existingItemId) {
            const item = await ItemModel.findById(updates.existingItemId);
            if (!item) {
                return res.status(400).json({ error: 'Item existente não encontrado' });
            }
        }
        if (updates.requestedBy) {
            const user = await UserModel.findById(updates.requestedBy);
            if (!user) {
                return res.status(400).json({ error: 'Usuário solicitante não encontrado' });
            }
        }
        const purchaseItem = await PurchaseItemModel.findByIdAndUpdate(id, updates, { new: true });
        if (!purchaseItem) {
            return res.status(404).json({ error: 'Item de compra não encontrado' });
        }
        res.json(transformDocument(purchaseItem));
    }
    catch (error) {
        console.error('Erro ao atualizar item de compra:', error);
        res.status(500).json({ error: 'Erro ao atualizar item de compra' });
    }
};
export const getPurchaseItemById = async (req, res) => {
    try {
        const purchaseItem = await PurchaseItemModel.findById(req.params.id);
        if (!purchaseItem) {
            return res.status(404).json({ error: 'Item de compra não encontrado' });
        }
        res.json(transformDocument(purchaseItem));
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar item de compra' });
    }
};
export const deletePurchaseItem = async (req, res) => {
    try {
        const purchaseItem = await PurchaseItemModel.findByIdAndDelete(req.params.id);
        if (!purchaseItem) {
            return res.status(404).json({ error: 'Item de compra não encontrado' });
        }
        res.json({ message: 'Item de compra deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar item de compra' });
    }
};
