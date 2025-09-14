#!/usr/bin/env node

import { dbInitializer } from './initDatabase';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

interface CreateAdminOptions {
  name?: string;
  email?: string;
  password?: string;
  list?: boolean;
  reset?: string;
  newPassword?: string;
}

interface AdminConfig {
  name?: string;
  email?: string;
  password?: string;
}

class AdminCLI {
  private parseArguments(): CreateAdminOptions {
    const args = process.argv.slice(2);
    const options: CreateAdminOptions = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '--name':
        case '-n':
          options.name = nextArg;
          i++;
          break;
        case '--email':
        case '-e':
          options.email = nextArg;
          i++;
          break;
        case '--password':
        case '-p':
          options.password = nextArg;
          i++;
          break;
        case '--list':
        case '-l':
          options.list = true;
          break;
        case '--reset':
        case '-r':
          options.reset = nextArg;
          i++;
          break;
        case '--new-password':
          options.newPassword = nextArg;
          i++;
          break;
        case '--help':
        case '-h':
          this.showHelp();
          process.exit(0);
          break;
      }
    }

    return options;
  }

  private showHelp(): void {
    console.log(`
🔧 CLI para Gerenciamento de Administradores

COMANDOS:
  npm run create-admin                    Criar admin padrão
  npm run create-admin -- --list          Listar todos os admins
  npm run create-admin -- --help          Mostrar esta ajuda

OPÇÕES:
  -n, --name <nome>           Nome do administrador
  -e, --email <email>         Email do administrador
  -p, --password <senha>      Senha do administrador
  -l, --list                  Listar administradores existentes
  -r, --reset <email>         Redefinir senha de um admin
  --new-password <senha>      Nova senha para redefinição

EXEMPLOS:
  # Criar admin padrão
  npm run create-admin

  # Criar admin personalizado
  npm run create-admin -- --name "João Silva" --email "joao@empresa.com" --password "minhasenha123"

  # Listar admins
  npm run create-admin -- --list

  # Redefinir senha
  npm run create-admin -- --reset "admin@sistema.com" --new-password "novasenha123"

NOTAS:
  - Se não especificar dados, será criado admin padrão
  - Email: admin@sistema.com
  - Senha: admin123
  - SEMPRE altere a senha padrão após primeiro login!
`);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): string[] {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    return errors;
  }

  async run(): Promise<void> {
    console.log('🚀 Iniciando CLI de Administradores...\n');

    try {
      // Conectar ao MongoDB primeiro
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/patrimonio';
      await mongoose.connect(mongoUri);
      console.log('✅ Conectado ao MongoDB com sucesso!\n');

      const options = this.parseArguments();

      // Listar admins
      if (options.list) {
        await dbInitializer.listAdmins();
        return;
      }

      // Redefinir senha
      if (options.reset) {
        if (!options.newPassword) {
          console.error('❌ Erro: --new-password é obrigatório para redefinir senha');
          process.exit(1);
        }

        if (!this.validateEmail(options.reset)) {
          console.error('❌ Erro: Email inválido');
          process.exit(1);
        }

        const passwordErrors = this.validatePassword(options.newPassword);
        if (passwordErrors.length > 0) {
          console.error('❌ Erro na senha:');
          passwordErrors.forEach(error => console.error(`   - ${error}`));
          process.exit(1);
        }

        await dbInitializer.resetAdminPassword(options.reset, options.newPassword);
        process.exit(0);
      }

      // Validações para criação
      if (options.email && !this.validateEmail(options.email)) {
        console.error('❌ Erro: Email inválido');
        process.exit(1);
      }

      if (options.password) {
        const passwordErrors = this.validatePassword(options.password);
        if (passwordErrors.length > 0) {
          console.error('❌ Erro na senha:');
          passwordErrors.forEach(error => console.error(`   - ${error}`));
          process.exit(1);
        }
      }

      // Criar admin
      const adminConfig = {
        name: options.name || 'Administrador',
        email: options.email || 'admin@sistema.com',
        password: options.password || 'admin123'
      };

      await dbInitializer.createDefaultAdmin(adminConfig);

    } catch (error) {
      console.error('❌ Erro no CLI:', error);
      process.exit(1);
    } finally {
      // Fechar conexão com MongoDB
      await mongoose.connection.close();
      console.log('\n🔌 Conexão com MongoDB fechada.');
    }
  }
}

// Executar CLI se chamado diretamente
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const cli = new AdminCLI();
  cli.run().then(() => {
    console.log('\n✅ CLI executado com sucesso!');
    process.exit(0);
  }).catch((error) => {
    console.error('\n❌ Erro na execução:', error);
    process.exit(1);
  });
}

export default AdminCLI;
