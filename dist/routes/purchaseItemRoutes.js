import { Router } from 'express';
import { getAllPurchaseItems, createPurchaseItem, updatePurchaseItem, deletePurchaseItem } from '../controllers/purchaseItemController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
const router = Router();
// Todas as rotas requerem autenticação
router.use(authenticate);
router.get('/', getAllPurchaseItems);
// Rotas que requerem admin
router.post('/', requireAdmin, createPurchaseItem);
router.put('/:id', requireAdmin, updatePurchaseItem);
router.delete('/:id', requireAdmin, deletePurchaseItem);
export default router;
