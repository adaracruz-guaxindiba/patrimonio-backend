export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  // Localização (opcional)
  cep?: string;
  city?: string;
  state?: string;
  street?: string;
  neighborhood?: string;
  phone?: string;
  // Campos para recuperação de senha
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
  acquiredAt: string; // ISO string
  createdAt: string;  // ISO string
}

export interface Loan {
  id: string;
  itemId: string;
  lenderUserId: string;    // quem empresta
  borrowerUserId: string;  // para quem empresta
  statusId: string;
  loanedAt: string; // ISO
  dueAt: string;    // ISO
  createdAt: string; // ISO
}

export interface PurchaseItem {
  id: string;
  itemName: string;
  existingItemId?: string; // ID do item existente, se aplicável
  quantity: number;
  justification: string;
  priority: 'baixa' | 'média' | 'alta' | 'urgente';
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'comprado';
  requestedBy: string; // ID do usuário que solicitou
  createdAt: string;
  updatedAt: string;
}