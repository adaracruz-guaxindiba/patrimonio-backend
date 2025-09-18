import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

// Importar rotas
import userRoutes from './routes/userRoutes.js';
import sectorRoutes from './routes/sectorRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import purchaseItemRoutes from './routes/purchaseItemRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sistema de Patrimônio API' });
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/purchase-items', purchaseItemRoutes);

// Handler para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler de erro global
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro interno:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();