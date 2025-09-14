import { Router } from 'express';
import { getAllStatuses, createStatus, updateStatus, deleteStatus, toggleStatusActive } from '../controllers/statusController';
import { authenticate, requireAdmin } from '../middleware/auth';
const router = Router();
// Todas as rotas requerem autenticação
router.use(authenticate);
router.get('/', getAllStatuses);
// Rotas que requerem admin
router.post('/', requireAdmin, createStatus);
router.put('/:id', requireAdmin, updateStatus);
router.delete('/:id', requireAdmin, deleteStatus);
router.patch('/:id/toggle', requireAdmin, toggleStatusActive);
export default router;
