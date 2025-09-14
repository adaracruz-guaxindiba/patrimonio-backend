import mongoose from 'mongoose';
import { dbInitializer } from '../scripts/initDatabase';
export const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/patrimonio';
        await mongoose.connect(mongoUri);
        console.log('✅ Conectado ao MongoDB com sucesso!');
        // Verificar e criar admin se necessário
        await ensureAdminExists();
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
};
const ensureAdminExists = async () => {
    try {
        const hasAdmin = await dbInitializer.hasActiveAdmin();
        if (!hasAdmin) {
            console.log('⚠️  Nenhum administrador ativo encontrado. Criando admin padrão...');
            await dbInitializer.createDefaultAdmin();
        }
        else {
            console.log('✅ Sistema possui administradores ativos.');
        }
    }
    catch (error) {
        console.error('❌ Erro ao verificar/criar admin:', error);
    }
};
