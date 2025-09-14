export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    cep?: string;
    city?: string;
    state?: string;
    street?: string;
    neighborhood?: string;
    phone?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastPasswordReset?: Date;
    isTemporaryPassword?: boolean;
}
export interface Sector {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
}
export interface Brand {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
}
export interface StatusItem {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
}
export interface Item {
    id: string;
    name: string;
    description: string;
    sectorId: string;
    brandId: string;
    statusId: string;
    acquiredAt: string;
    createdAt: string;
}
export interface Loan {
    id: string;
    itemId: string;
    lenderUserId: string;
    borrowerUserId: string;
    statusId: string;
    loanedAt: string;
    dueAt: string;
    createdAt: string;
}
export interface PurchaseItem {
    id: string;
    itemName: string;
    existingItemId?: string;
    quantity: number;
    justification: string;
    priority: 'baixa' | 'média' | 'alta' | 'urgente';
    status: 'pendente' | 'aprovado' | 'rejeitado' | 'comprado';
    requestedBy: string;
    createdAt: string;
    updatedAt: string;
}
