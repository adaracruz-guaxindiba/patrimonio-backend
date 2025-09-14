interface AdminConfig {
    name: string;
    email: string;
    password: string;
}
declare class DatabaseInitializer {
    /**
     * Cria usuário admin padrão se não existir
     */
    createDefaultAdmin(config?: AdminConfig): Promise<void>;
    /**
     * Cria múltiplos usuários admin
     */
    createMultipleAdmins(admins: AdminConfig[]): Promise<void>;
    /**
     * Verifica se existe pelo menos um admin ativo
     */
    hasActiveAdmin(): Promise<boolean>;
    /**
     * Lista todos os administradores
     */
    listAdmins(): Promise<void>;
    /**
     * Redefine senha de um admin
     */
    resetAdminPassword(email: string, newPassword: string): Promise<void>;
    /**
     * Inicializa o banco com dados essenciais
     */
    initializeDatabase(): Promise<void>;
}
export declare const dbInitializer: DatabaseInitializer;
export default dbInitializer;
