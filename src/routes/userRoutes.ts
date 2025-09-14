import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  createUserWithTempPassword,
  changePassword
} from '../controllers/userController';
import { authenticateToken, requireAdmin, requireOwnershipOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Rotas públicas (sem autenticação)
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Rotas protegidas - requerem autenticação
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, getUserById);
router.get('/email/:email', authenticateToken, requireAdmin, getUserByEmail);
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);
router.post('/change-password/:id', authenticateToken, requireOwnershipOrAdmin, changePassword);

// Rotas administrativas - requerem admin
router.post('/', authenticateToken, requireAdmin, createUser);
router.post('/create-with-temp-password', authenticateToken, requireAdmin, createUserWithTempPassword);

export default router;