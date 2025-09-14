import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendPasswordResetEmail(to: string, resetToken: string, userName: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"Sistema de Patrimônio" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Recuperação de Senha - Sistema de Patrimônio',
        html: this.getPasswordResetTemplate(userName, resetUrl)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email de recuperação enviado para: ${to}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, userName: string, tempPassword: string): Promise<boolean> {
    try {
      const loginUrl = `${process.env.FRONTEND_URL}/login`;
      
      const mailOptions = {
        from: `"Sistema de Patrimônio" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Bem-vindo ao Sistema de Patrimônio',
        html: this.getWelcomeTemplate(userName, tempPassword, loginUrl)
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email de boas-vindas enviado para: ${to}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email de boas-vindas:', error);
      return false;
    }
  }

  private getPasswordResetTemplate(userName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sistema de Patrimônio</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Você solicitou a recuperação de sua senha. Clique no botão abaixo para criar uma nova senha:</p>
            <a href="${resetUrl}" class="button">Redefinir Senha</a>
            <p><strong>Este link expira em 1 hora.</strong></p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
          </div>
          <div class="footer">
            <p>Sistema de Patrimônio - Gestão Inteligente</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeTemplate(userName: string, tempPassword: string, loginUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .credentials { background: #e5e7eb; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bem-vindo ao Sistema de Patrimônio!</h1>
          </div>
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Sua conta foi criada com sucesso. Use as credenciais abaixo para fazer login:</p>
            <div class="credentials">
              <p><strong>Senha temporária:</strong> ${tempPassword}</p>
            </div>
            <p><strong>⚠️ Por segurança, altere sua senha no primeiro acesso.</strong></p>
            <a href="${loginUrl}" class="button">Fazer Login</a>
          </div>
          <div class="footer">
            <p>Sistema de Patrimônio - Gestão Inteligente</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Conexão com servidor de email OK');
      return true;
    } catch (error) {
      console.error('❌ Erro na conexão com servidor de email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
