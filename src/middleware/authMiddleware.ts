import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/tokenService.js';

// Estender interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        isAdmin: boolean;
      };
    }
  }
}

/**
 * Middleware para verificar autenticação JWT
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  const decoded = tokenService.validateJWT(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }

  req.user = decoded;
  next();
};

/**
 * Middleware para verificar se usuário é admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado. Privilégios de admin requeridos' });
  }

  next();
};

/**
 * Middleware para verificar se usuário pode acessar próprios dados ou é admin
 */
export const requireOwnershipOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const targetUserId = req.params.id;
  
  // Admin pode acessar qualquer usuário
  if (req.user.isAdmin) {
    return next();
  }

  // Usuário só pode acessar próprios dados
  if (req.user.userId === targetUserId) {
    return next();
  }

  return res.status(403).json({ error: 'Acesso negado. Você só pode acessar seus próprios dados' });
};

/**
 * Middleware opcional de autenticação (não falha se não houver token)
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = tokenService.validateJWT(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};
