import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { connectDatabase } from '../config/database.js';

interface AdminConfig {
  name: string;
  email: string;
  password: string;
}

class DatabaseInitializer {
  /**
   * Cria usuário admin padrão se não existir
   */
  async createDefaultAdmin(config?: AdminConfig): Promise<void> {
    const defaultConfig: AdminConfig = {
      name: config?.name || 'Administrador',
      email: config?.email || 'admin@sistema.com',
      password: config?.password || 'admin123'
    };

    try {
      // Verificar se já existe um admin
      const existingAdmin = await UserModel.findOne({ 
        email: defaultConfig.email 
      });

      if (existingAdmin) {
        console.log(`✅ Admin já existe: ${defaultConfig.email}`);
        return;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(defaultConfig.password, 10);

      // Criar admin
      const admin = new UserModel({
        name: defaultConfig.name,
        email: defaultConfig.email,
        password: hashedPassword,
        isAdmin: true,
        isActive: true
      });

      await admin.save();
      
      console.log('🎉 Usuário admin criado com sucesso!');
      console.log(`📧 Email: ${defaultConfig.email}`);
      console.log(`🔑 Senha: ${defaultConfig.password}`);
      console.log('⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');
      
    } catch (error) {
      console.error('❌ Erro ao criar usuário admin:', error);
      throw error;
    }
  }

  /**
   * Cria múltiplos usuários admin
   */
  async createMultipleAdmins(admins: AdminConfig[]): Promise<void> {
    console.log(`🔄 Criando ${admins.length} administradores...`);
    
    for (const admin of admins) {
      await this.createDefaultAdmin(admin);
    }
    
    console.log('✅ Processo de criação de admins concluído!');
  }

  /**
   * Verifica se existe pelo menos um admin ativo
   */
  async hasActiveAdmin(): Promise<boolean> {
    try {
      const adminCount = await UserModel.countDocuments({ 
        isAdmin: true, 
        isActive: true 
      });
      return adminCount > 0;
    } catch (error) {
      console.error('❌ Erro ao verificar admins:', error);
      return false;
    }
  }

  /**
   * Lista todos os administradores
   */
  async listAdmins(): Promise<void> {
    try {
      const admins = await UserModel.find({ 
        isAdmin: true 
      }).select('name email isActive createdAt');

      console.log('\n📋 Lista de Administradores:');
      console.log('================================');
      
      if (admins.length === 0) {
        console.log('❌ Nenhum administrador encontrado!');
        return;
      }

      admins.forEach((admin, index) => {
        const status = admin.isActive ? '✅ Ativo' : '❌ Inativo';
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   📧 ${admin.email}`);
        console.log(`   📊 ${status}`);
        console.log(`   📅 Criado em: ${admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}`);
        console.log('');
      });
      
    } catch (error) {
      console.error('❌ Erro ao listar admins:', error);
    }
  }

  /**
   * Redefine senha de um admin
   */
  async resetAdminPassword(email: string, newPassword: string): Promise<void> {
    try {
      const admin = await UserModel.findOne({ 
        email: email.toLowerCase(),
        isAdmin: true 
      });

      if (!admin) {
        console.log('❌ Admin não encontrado!');
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      admin.lastPasswordReset = new Date();
      admin.isTemporaryPassword = false;

      await admin.save();
      
      console.log(`✅ Senha do admin ${email} foi redefinida!`);
      console.log(`🔑 Nova senha: ${newPassword}`);
      
    } catch (error) {
      console.error('❌ Erro ao redefinir senha:', error);
    }
  }

  /**
   * Inicializa o banco com dados essenciais
   */
  async initializeDatabase(): Promise<void> {
    try {
      console.log('🚀 Inicializando banco de dados...');
      
      // Conectar ao banco
      await connectDatabase();
      
      // Verificar se há admin
      const hasAdmin = await this.hasActiveAdmin();
      
      if (!hasAdmin) {
        console.log('⚠️  Nenhum admin encontrado. Criando admin padrão...');
        await this.createDefaultAdmin();
      } else {
        console.log('✅ Sistema já possui administradores ativos.');
      }
      
      // Listar admins existentes
      await this.listAdmins();
      
      console.log('🎉 Inicialização do banco concluída!');
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      process.exit(1);
    }
  }
}

export const dbInitializer = new DatabaseInitializer();
export default dbInitializer;
