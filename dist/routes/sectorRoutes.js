import { Router } from 'express';
import { getAllSectors, createSector, updateSector, deleteSector, toggleSectorActive } from '../controllers/sectorController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
const router = Router();
// Todas as rotas requerem autenticação
router.use(authenticate);
router.get('/', getAllSectors);
// Rotas que requerem admin
router.post('/', requireAdmin, createSector);
router.put('/:id', requireAdmin, updateSector);
router.delete('/:id', requireAdmin, deleteSector);
router.patch('/:id/toggle', requireAdmin, toggleSectorActive);
export default router;
