interface ResetTokenData {
    userId: string;
    email: string;
    timestamp: number;
}
declare class TokenService {
    private readonly JWT_SECRET;
    private readonly RESET_TOKEN_EXPIRY;
    /**
     * Gera um token seguro para recuperação de senha
     */
    generateResetToken(userId: string, email: string): string;
    /**
     * Gera uma senha temporária segura
     */
    generateTempPassword(length?: number): string;
    /**
     * Valida e decodifica um token de recuperação
     */
    validateResetToken(token: string): ResetTokenData | null;
    /**
     * Gera um hash único para identificar sessões
     */
    generateSessionHash(): string;
    /**
     * Gera um código numérico para verificação (opcional para 2FA futuro)
     */
    generateVerificationCode(length?: number): string;
    private getRandomChar;
    /**
     * Valida se um JWT é válido (para middleware de autenticação)
     */
    validateJWT(token: string): any;
    /**
     * Gera um JWT para autenticação normal
     */
    generateAuthToken(userId: string, email: string, isAdmin: boolean): string;
}
export declare const tokenService: TokenService;
export {};
