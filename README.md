# API de Autenticação e Recuperação de Senha

## Endpoints Implementados

### 🔐 **Autenticação**

#### `POST /api/users/login`
Realiza login do usuário.

**Body:**
```json
{
  "email": "admin@sistema.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@sistema.com",
    "isAdmin": true,
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📧 **Recuperação de Senha**

#### `POST /api/users/request-password-reset`
Solicita recuperação de senha via email.

**Body:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Resposta:**
```json
{
  "message": "Se o email existir, você receberá instruções para recuperação"
}
```

#### `POST /api/users/reset-password`
Redefine senha usando token do email.

**Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "novaSenha123"
}
```

**Resposta:**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

---

### 🔑 **Alteração de Senha**

#### `POST /api/users/change-password/:id`
Altera senha do usuário logado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

**Resposta:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

### 👥 **Gestão de Usuários (Admin)**

#### `POST /api/users/create-with-temp-password`
Cria usuário com senha temporária e envia por email.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "isAdmin": false,
  "isActive": true
}
```

**Resposta:**
```json
{
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "isTemporaryPassword": true
  }
}
```

---

## 🔒 **Autenticação nas Rotas**

### Headers Necessários
Para rotas protegidas, inclua o token JWT:
```
Authorization: Bearer <seu-token-jwt>
```

### Níveis de Acesso
- **Público**: Login, recuperação de senha
- **Usuário**: Alterar própria senha, ver próprios dados
- **Admin**: Todas as operações de usuários

---

## ⚙️ **Configuração de Email**

### Variáveis de Ambiente Necessárias
```env
# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

### Para Gmail
1. Ativar autenticação de 2 fatores
2. Gerar senha de app específica
3. Usar a senha de app no `SMTP_PASS`

---

## 🚀 **Como Testar**

### 1. Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.com","password":"admin123"}'
```

### 2. Solicitar Recuperação
```bash
curl -X POST http://localhost:3001/api/users/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sistema.com"}'
```

### 3. Alterar Senha
```bash
curl -X POST http://localhost:3001/api/users/change-password/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"currentPassword":"senhaAtual","newPassword":"novaSenha"}'
```

---

## 📝 **Códigos de Erro**

- `400`: Dados inválidos
- `401`: Não autenticado
- `403`: Sem permissão
- `404`: Usuário não encontrado
- `500`: Erro interno do servidor

---

## 🔧 **Recursos Implementados**

✅ Login com JWT  
✅ Recuperação de senha por email  
✅ Tokens seguros com expiração  
✅ Templates HTML para emails  
✅ Senhas temporárias para novos usuários  
✅ Middleware de autenticação  
✅ Controle de acesso por níveis  
✅ Validação de dados  
✅ Logs de segurança
