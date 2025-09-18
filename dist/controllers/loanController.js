import { LoanModel } from '../models/Loan.js';
import { ItemModel } from '../models/Item.js';
import { UserModel } from '../models/User.js';
import { StatusModel } from '../models/Status.js';
export const getAllLoans = async (req, res) => {
    try {
        const loans = await LoanModel.find().sort({ createdAt: -1 });
        res.json(loans);
    }
    catch (error) {
        const err = error;
        console.error('Erro ao buscar empréstimos:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
            fullError: err
        });
        res.status(500).json({
            error: 'Erro ao buscar empréstimos',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
export const createLoan = async (req, res) => {
    try {
        const { itemId, lenderUserId, borrowerUserId, statusId, loanedAt, dueAt } = req.body;
        console.log('=== DADOS RECEBIDOS NO BACKEND ===');
        console.log('Request body completo:', req.body);
        console.log('itemId:', itemId, 'Tipo:', typeof itemId);
        console.log('lenderUserId:', lenderUserId, 'Tipo:', typeof lenderUserId);
        console.log('borrowerUserId:', borrowerUserId, 'Tipo:', typeof borrowerUserId);
        console.log('statusId:', statusId, 'Tipo:', typeof statusId);
        // Verificar se as referências existem
        const [item, lender, borrower, status] = await Promise.all([
            ItemModel.findById(itemId),
            UserModel.findById(lenderUserId),
            UserModel.findById(borrowerUserId),
            StatusModel.findById(statusId)
        ]);
        if (!item) {
            return res.status(400).json({ error: 'Item não encontrado' });
        }
        if (!lender) {
            return res.status(400).json({ error: 'Usuário que empresta não encontrado' });
        }
        if (!borrower) {
            return res.status(400).json({ error: 'Usuário que recebe não encontrado' });
        }
        if (!status) {
            return res.status(400).json({ error: 'Status não encontrado' });
        }
        const loan = new LoanModel({
            itemId,
            lenderUserId,
            borrowerUserId,
            statusId,
            loanedAt,
            dueAt
        });
        await loan.save();
        res.status(201).json(loan);
    }
    catch (error) {
        const err = error;
        console.error('Erro ao criar empréstimo:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
            fullError: err,
            requestBody: req.body
        });
        res.status(500).json({
            error: 'Erro ao criar empréstimo',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
        // Alternative with type guard for safer error handling:
        /*
        const err = error instanceof Error ? error : new Error('Unknown error occurred');
        console.error('Erro ao criar empréstimo:', {
          message: err.message,
          name: err.name,
          stack: err.stack,
          fullError: err,
          requestBody: req.body
        });
        res.status(500).json({
          error: 'Erro ao criar empréstimo',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
        */
    }
};
export const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        // Verificar referências se estão sendo atualizadas
        if (updates.itemId) {
            const item = await ItemModel.findById(updates.itemId);
            if (!item) {
                return res.status(400).json({ error: 'Item não encontrado' });
            }
        }
        if (updates.lenderUserId) {
            const user = await UserModel.findById(updates.lenderUserId);
            if (!user) {
                return res.status(400).json({ error: 'Usuário que empresta não encontrado' });
            }
        }
        if (updates.borrowerUserId) {
            const user = await UserModel.findById(updates.borrowerUserId);
            if (!user) {
                return res.status(400).json({ error: 'Usuário que recebe não encontrado' });
            }
        }
        if (updates.statusId) {
            const status = await StatusModel.findById(updates.statusId);
            if (!status) {
                return res.status(400).json({ error: 'Status não encontrado' });
            }
        }
        const loan = await LoanModel.findByIdAndUpdate(id, updates, { new: true });
        if (!loan) {
            return res.status(404).json({ error: 'Empréstimo não encontrado' });
        }
        res.json(loan);
    }
    catch (error) {
        const err = error;
        console.error('Erro ao atualizar empréstimo:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
            fullError: err
        });
        res.status(500).json({
            error: 'Erro ao atualizar empréstimo',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
export const deleteLoan = async (req, res) => {
    try {
        const loan = await LoanModel.findByIdAndDelete(req.params.id);
        if (!loan) {
            return res.status(404).json({ error: 'Empréstimo não encontrado' });
        }
        res.json({ message: 'Empréstimo deletado com sucesso' });
    }
    catch (error) {
        const err = error;
        console.error('Erro ao deletar empréstimo:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
            fullError: err
        });
        res.status(500).json({
            error: 'Erro ao deletar empréstimo',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
