import { Router } from 'express';
import { getAllItems, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
const router = Router();
// Todas as rotas requerem autenticação
router.use(authenticate);
router.get('/', getAllItems);
// Rotas que requerem admin
router.post('/', requireAdmin, createItem);
router.put('/:id', requireAdmin, updateItem);
router.delete('/:id', requireAdmin, deleteItem);
export default router;
