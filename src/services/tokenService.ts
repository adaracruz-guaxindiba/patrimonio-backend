import crypto from 'crypto';
import jwt from 'jsonwebtoken';

interface ResetTokenData {
  userId: string;
  email: string;
  timestamp: number;
}

class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hora em milliseconds

  /**
   * Gera um token seguro para recuperação de senha
   */
  generateResetToken(userId: string, email: string): string {
    const tokenData: ResetTokenData = {
      userId,
      email,
      timestamp: Date.now()
    };

    return jwt.sign(tokenData, this.JWT_SECRET, { expiresIn: '1h' });
  }

  /**
   * Gera uma senha temporária segura
   */
  generateTempPassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let password = '';
    
    // Garantir pelo menos um de cada tipo
    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // Maiúscula
    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz'); // Minúscula
    password += this.getRandomChar('0123456789'); // Número
    password += this.getRandomChar('!@#$%&*'); // Símbolo
    
    // Preencher o resto
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(charset);
    }
    
    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Valida e decodifica um token de recuperação
   */
  validateResetToken(token: string): ResetTokenData | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as ResetTokenData;
      
      // Verificar se o token não expirou (dupla verificação)
      const now = Date.now();
      const tokenAge = now - decoded.timestamp;
      
      if (tokenAge > this.RESET_TOKEN_EXPIRY) {
        console.log('🔒 Token de recuperação expirado');
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.log('🔒 Token de recuperação inválido:', error);
      return null;
    }
  }

  /**
   * Gera um hash único para identificar sessões
   */
  generateSessionHash(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Gera um código numérico para verificação (opcional para 2FA futuro)
   */
  generateVerificationCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return code;
  }

  private getRandomChar(charset: string): string {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }

  /**
   * Valida se um JWT é válido (para middleware de autenticação)
   */
  validateJWT(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  /**
   * Gera um JWT para autenticação normal
   */
  generateAuthToken(userId: string, email: string, isAdmin: boolean): string {
    return jwt.sign(
      { userId, email, isAdmin },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

export const tokenService = new TokenService();
