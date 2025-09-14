import { Router } from 'express';
import { getAllLoans, createLoan, updateLoan, deleteLoan } from '../controllers/loanController';
import { authenticate, requireAdmin } from '../middleware/auth';
const router = Router();
// Todas as rotas requerem autenticação
router.use(authenticate);
router.get('/', getAllLoans);
// Rotas que requerem admin
router.post('/', requireAdmin, createLoan);
router.put('/:id', requireAdmin, updateLoan);
router.delete('/:id', requireAdmin, deleteLoan);
export default router;
