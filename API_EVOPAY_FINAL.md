# 🎉 API EVOPAY - CONFIGURAÇÃO FINAL

## ✅ Endpoints Descobertos e Configurados

### URL Base:
```
https://pix.evopay.cash/v1
```

### Autenticação:
```
Header: API-Key: 5aef8004-9644-4dda-85a4-163fae7439ae
```

---

## 📋 Endpoints Disponíveis

### 1. ✅ **Verificar Saldo** (TESTADO E FUNCIONANDO)
```http
GET /account/balance
Headers: { "API-Key": "..." }

Resposta:
{
  "balance": -0.6,
  "eligibleWithdraw": 0
}
```

### 2. ✅ **Criar Pagamento PIX** (ENDPOINT DESCOBERTO)
```http
POST /pix
Headers: { 
  "API-Key": "...",
  "Content-Type": "application/json"
}
Body: {
  "amount": 1.00,  // Mínimo: R$ 1,00 (não aceita centavos)
  "callbackUrl": "https://seu-site.com/callback"
}

Resposta esperada:
{
  "id": "pix_abc123",
  "qrCode": "data:image/png;base64,...",
  "qrCodeUrl": "https://...",
  "pixCopyPaste": "00020126...",
  "status": "PENDING",
  ...
}
```

⚠️ **IMPORTANTE:** O valor mínimo é **R$ 1,00**. Valores abaixo disso retornam erro:
```json
{
  "error": "Error",
  "message": "body/amount must be >= 1"
}
```

### 3. ✅ **Verificar Status do Pagamento**
```http
GET /pix/{id}
Headers: { "API-Key": "..." }

Resposta esperada:
{
  "id": "pix_abc123",
  "status": "PENDING" | "COMPLETED" | "CANCELED",
  "amount": 1.00,
  ...
}
```

### 4. ✅ **Listar Transações**
```http
GET /account/transactions?limit=10&page=1&type=DEPOSIT&status=COMPLETED
Headers: { "API-Key": "..." }
```

### 5. ✅ **Métricas**
```http
GET /account/summary?dateFrom=2024-01-01&dateTo=2024-01-31&groupBy=day&grouped=true
Headers: { "API-Key": "..." }
```

---

## 🚀 Como Usar

### 1. Verificar se servidores estão rodando:
```bash
ps aux | grep -E "(proxy-evopay|http.server)" | grep -v grep
```

### 2. Se não estiverem, iniciar:
```bash
cd /Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop
./iniciar-servidor-completo.sh
```

### 3. Acessar página de testes:
```
http://localhost:8000/test-evopay.html
```

### 4. Executar testes na ordem:
- ✅ **Teste 1: Verificar Saldo** → Funciona!
- 🧪 **Teste 2: Criar Pagamento (R$ 1,00)** → Pronto para testar
- 🧪 **Teste 3: Verificar Status** → Após criar pagamento
- 🧪 **Teste 4: Listar Transações** → Após criar pagamento

---

## 🧪 Testar no Console do Navegador

```javascript
// 1. Verificar saldo
await window.evopayInstance.getBalance()
// Resultado: {"balance": -0.6, "eligibleWithdraw": 0}

// 2. Criar pagamento PIX de R$ 1,00
await window.evopayInstance.createPixPayment({
  amount: 1.00,
  productName: "Teste",
  customerName: "Cliente Teste",
  customerEmail: "teste@email.com",
  customerPhone: "11999999999",
  customerDocument: "12345678900"
})
// Resultado: { id: "...", qrCode: "...", pixCopyPaste: "..." }

// 3. Verificar status (substitua ID_DO_PAGAMENTO)
await window.evopayInstance.checkPaymentStatus("ID_DO_PAGAMENTO")

// 4. Listar transações
await window.evopayInstance.listPayments()
```

---

## 📊 Arquitetura Completa

```
┌─────────────────────────────────────────┐
│  Frontend React (localhost:8000)        │
│  - TikTok Shop                          │
│  - evopay-integration.js                │
│  - Intercepta chamadas Supabase         │
└────────────────┬────────────────────────┘
                 │ HTTP (sem CORS ✅)
                 ▼
┌─────────────────────────────────────────┐
│  Proxy Python (localhost:8001)          │
│  - proxy-evopay.py                      │
│  - Adiciona headers CORS                │
│  - Repassa requisições                  │
└────────────────┬────────────────────────┘
                 │ HTTPS + API-Key 🔑
                 ▼
┌─────────────────────────────────────────┐
│  API EvoPay (pix.evopay.cash/v1)        │
│                                         │
│  ✅ GET  /account/balance               │
│  ✅ POST /pix                           │
│  ✅ GET  /pix/{id}                      │
│  ✅ GET  /account/transactions          │
│  ✅ GET  /account/summary               │
└─────────────────────────────────────────┘
```

---

## ⚠️ Regras Importantes

### Valores:
- ✅ Mínimo: **R$ 1,00**
- ❌ NÃO aceita: R$ 0,01 ou R$ 0,50
- ✅ Aceita: R$ 1,00, R$ 10,90, R$ 100,50

### Parâmetros Obrigatórios (POST /pix):
- `amount` (float, >= 1.0)
- `callbackUrl` (opcional mas recomendado)

### Parâmetros Opcionais:
- Todos os outros (metadata, customer info, etc) são opcionais

---

## 🐛 Troubleshooting

### Erro: "body/amount must be >= 1"
- **Causa:** Valor menor que R$ 1,00
- **Solução:** Use no mínimo `amount: 1.00`

### Erro: "Route POST:/v1/pix/deposit not found"
- **Causa:** Endpoint incorreto
- **Solução:** Já corrigido! Endpoint é `/pix` (não `/pix/deposit`)

### Erro: CORS blocked
- **Causa:** Proxy não está rodando
- **Solução:** Execute `python3 proxy-evopay.py`

### Saldo negativo?
- **Normal!** Significa que você tem crédito negativo
- Adicione fundos no dashboard: https://app.evopay.cash/

---

## 📚 Documentação Oficial

- **Docs:** [https://docs.evopay.cash/](https://docs.evopay.cash/)
- **Dashboard:** https://app.evopay.cash/
- **Base URL:** https://pix.evopay.cash/v1

---

## 🎉 Status da Integração

```
✅ URL Base descoberta: pix.evopay.cash/v1
✅ Endpoint POST descoberto: /pix
✅ Valor mínimo identificado: R$ 1,00
✅ Saldo funcionando: {"balance": -0.6}
✅ Proxy configurado: localhost:8001
✅ CORS resolvido
✅ Código atualizado
✅ Testes prontos
```

---

## 🎯 Próximo Passo

**TESTE AGORA:**
```
http://localhost:8000/test-evopay.html
```

Clique em **"Criar Pagamento Teste (R$ 1,00)"** e veja o QR Code PIX ser gerado! 🚀

---

**Criado em:** 04/11/2025  
**Última atualização:** 04/11/2025  
**Status:** ✅ PRONTO PARA TESTAR

