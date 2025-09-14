import { Router } from 'express';
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandActive
} from '../controllers/brandController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get('/', getAllBrands);

// Rotas que requerem admin
router.post('/', requireAdmin, createBrand);
router.put('/:id', requireAdmin, updateBrand);
router.delete('/:id', requireAdmin, deleteBrand);
router.patch('/:id/toggle', requireAdmin, toggleBrandActive);

export default router;