import { Request, Response, NextFunction } from 'express';
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
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware para verificar se usuário é admin
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware para verificar se usuário pode acessar próprios dados ou é admin
 */
export declare const requireOwnershipOrAdmin: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Middleware opcional de autenticação (não falha se não houver token)
 */
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
