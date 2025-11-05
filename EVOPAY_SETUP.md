# 🚀 Configuração da API EvoPay para Pagamentos PIX

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Configuração Rápida](#configuração-rápida)
3. [Como Funciona](#como-funciona)
4. [Testando a Integração](#testando-a-integração)
5. [Estrutura da API](#estrutura-da-api)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A integração com a **EvoPay** substitui o sistema anterior (Supabase + Ziprapay) permitindo que você use sua própria API para gerar QR Codes PIX.

### ✨ Características
- ✅ Integração transparente (não requer modificar o código React)
- ✅ Intercepta chamadas do Supabase automaticamente
- ✅ Suporte completo para criação e verificação de pagamentos
- ✅ Logs detalhados no console para debug
- ✅ Tratamento de erros robusto

---

## ⚡ Configuração Rápida

### Passo 1: Obter sua API Key da EvoPay

1. Acesse o dashboard da EvoPay: https://dashboard.evopay.cash
2. Faça login na sua conta
3. Vá em **Configurações** > **API Keys**
4. Copie sua **API Key**

### Passo 2: Configurar a API Key no site

Abra o arquivo `index.html` e localize esta linha (linha 40):

```html
<meta name="evopay-api-key" content="SUA_API_KEY_AQUI">
```

**Substitua** `SUA_API_KEY_AQUI` pela sua API Key real:

```html
<meta name="evopay-api-key" content="evp_live_abc123xyz789...">
```

⚠️ **IMPORTANTE**: 
- Mantenha sua API Key em segredo
- Não compartilhe publicamente
- Para produção, considere usar variáveis de ambiente

### Passo 3: Reiniciar o servidor

```bash
# Se o servidor estiver rodando, pare com Ctrl+C e reinicie:
cd /Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop
python3 -m http.server 8000
```

### Passo 4: Verificar se está funcionando

1. Abra o navegador em: `http://localhost:8000`
2. Abra o **Console** (F12 > Console)
3. Você deve ver estas mensagens:

```
✅ EvoPay: Script carregado!
✅ EvoPay: API Key encontrada, inicializando...
✅ EvoPay: Configurando interceptor do Supabase...
✅ EvoPay: Conexão estabelecida. Saldo: { balance: 1234.56 }
✅ EvoPay: Integração ativa e funcionando!
```

---

## 🔧 Como Funciona

### Fluxo de Pagamento

```
┌─────────────┐
│   Cliente   │
│  clica em   │
│   Comprar   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  React Application  │
│  (tenta chamar)     │
│  Supabase Edge Fn   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ EvoPay Interceptor  │◄─── Intercepta a chamada
│  (nosso script)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   API EvoPay        │
│ api.evopay.cash     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   QR Code PIX       │
│   + Código Copia    │
│   e Cola            │
└─────────────────────┘
```

### Endpoints Utilizados

#### 1. **Criar Pagamento PIX**
```javascript
POST https://api.evopay.cash/v1/pix/payment
Headers: {
  "API-Key": "sua_api_key",
  "Content-Type": "application/json"
}
Body: {
  amount: 100.00,
  description: "iPhone 16 Pro Max",
  customer: {
    name: "João Silva",
    email: "joao@email.com",
    phone: "11999999999",
    document: "12345678900"
  }
}
```

**Resposta esperada:**
```json
{
  "id": "pay_abc123",
  "qrCode": "data:image/png;base64,...",
  "qrCodeUrl": "https://...",
  "pixCopyPaste": "00020126...",
  "status": "pending",
  "expiresAt": "2025-11-04T21:00:00Z"
}
```

#### 2. **Verificar Status do Pagamento**
```javascript
GET https://api.evopay.cash/v1/pix/payment/{payment_id}
Headers: {
  "API-Key": "sua_api_key"
}
```

**Resposta esperada:**
```json
{
  "id": "pay_abc123",
  "status": "paid",
  "amount": 100.00,
  "paidAt": "2025-11-04T20:15:30Z"
}
```

#### 3. **Verificar Saldo**
```javascript
GET https://api.evopay.cash/v1/balance
Headers: {
  "API-Key": "sua_api_key"
}
```

---

## 🧪 Testando a Integração

### Teste 1: Verificar Console do Navegador

```javascript
// Abra o console (F12) e digite:
console.log('API Key configurada:', window.evopayInstance ? 'SIM ✅' : 'NÃO ❌');
console.log('Interceptor ativo:', window.evopayInterceptor ? 'SIM ✅' : 'NÃO ❌');

// Testar conexão:
window.evopayInstance.getBalance().then(data => {
  console.log('Saldo:', data);
});
```

### Teste 2: Simular Criação de Pagamento

```javascript
// No console do navegador:
window.evopayInstance.createPixPayment({
  amount: 10.00,
  productName: "Teste de Produto",
  customerName: "Cliente Teste",
  customerEmail: "teste@email.com",
  customerPhone: "11999999999",
  customerDocument: "12345678900"
}).then(result => {
  console.log('Pagamento criado:', result);
  console.log('QR Code:', result.qrCode);
  console.log('Código Copia e Cola:', result.pixCopyPaste);
});
```

### Teste 3: Compra Real no Site

1. Navegue até um produto
2. Clique em **"Comprar Agora"**
3. Preencha os dados do formulário
4. Clique em **"Finalizar Compra"**
5. Verifique no console:

```
EvoPay: Interceptando create-payment
EvoPay: Criando pagamento PIX... {amount: 100, productName: "iPhone 16"}
EvoPay: Pagamento criado com sucesso! {paymentId: "pay_123", ...}
```

---

## 📚 Estrutura da API

### Classe `EvoPay`

```javascript
const evopay = new EvoPay(apiKey, apiUrl);

// Métodos disponíveis:
await evopay.init()                           // Inicializa conexão
await evopay.getBalance()                     // Consulta saldo
await evopay.createPixPayment(data)           // Cria pagamento
await evopay.checkPaymentStatus(paymentId)    // Verifica status
await evopay.listPayments(filters)            // Lista pagamentos
```

### Formato de Dados

#### Criar Pagamento:
```typescript
{
  amount: number,              // Valor em reais (ex: 100.50)
  productName: string,         // Nome do produto
  customerName: string,        // Nome completo
  customerEmail: string,       // Email válido
  customerPhone: string,       // Telefone (11999999999)
  customerDocument: string,    // CPF sem pontuação
  customerAddress?: {          // Opcional
    street: string,
    number: string,
    city: string,
    state: string,
    zipCode: string
  },
  orderId?: string            // ID customizado (opcional)
}
```

#### Resposta do Pagamento:
```typescript
{
  success: boolean,
  paymentId: string,
  qrCode: string,              // Base64 da imagem QR
  qrCodeUrl: string,           // URL pública do QR
  pixCopyPaste: string,        // Código PIX Copia e Cola
  expiresAt: string,           // ISO 8601 timestamp
  status: 'pending' | 'paid',
  rawData: object              // Resposta completa da API
}
```

---

## 🐛 Troubleshooting

### Problema: "API Key não configurada"

**Sintoma:**
```
⚠️ EvoPay: API Key não configurada
```

**Solução:**
1. Verifique se a meta tag está presente no HTML
2. Certifique-se de que o conteúdo não está vazio
3. Recarregue a página (Ctrl+R)

---

### Problema: "Erro ao criar pagamento: 401"

**Sintoma:**
```
EvoPay: Erro ao criar pagamento: Erro HTTP: 401
```

**Solução:**
1. API Key inválida ou expirada
2. Gere uma nova API Key no dashboard
3. Atualize a meta tag no HTML

---

### Problema: "Erro ao criar pagamento: 422"

**Sintoma:**
```
EvoPay: Erro ao criar pagamento: Erro HTTP: 422
```

**Solução:**
1. Dados inválidos no formulário
2. Verifique formato do CPF (apenas números)
3. Verifique formato do telefone (11999999999)
4. Verifique se o email é válido

---

### Problema: QR Code não aparece

**Sintomas:**
- O pagamento é criado com sucesso
- Mas o QR Code não é exibido na tela

**Solução:**
1. Abra o console e verifique a resposta:
```javascript
// Último pagamento criado
console.log(window.lastPaymentResponse);
```

2. Verifique se a API está retornando os campos corretos:
   - `qrCode` ou `qr_code` ou `pixQrCode`
   - `pixCopyPaste` ou `pix_copy_paste` ou `brCode`

3. Se os nomes dos campos forem diferentes, edite o arquivo:
   `js/evopay-integration.js` na linha ~80

---

### Problema: CORS Error

**Sintoma:**
```
Access to fetch at 'https://api.evopay.cash' blocked by CORS policy
```

**Solução:**
1. A API EvoPay precisa permitir requisições do seu domínio
2. Entre em contato com o suporte da EvoPay
3. Adicione seu domínio às origens permitidas
4. Para localhost, geralmente funciona sem problemas

---

### Problema: Pagamento não detecta confirmação

**Sintomas:**
- QR Code é gerado corretamente
- Cliente paga via PIX
- Status não muda para "pago"

**Solução:**
1. Verifique se a API EvoPay está retornando o webhook
2. Configure o webhook no dashboard EvoPay
3. URL do webhook deve apontar para seu backend
4. Verifique logs da API para confirmar callback

---

## 🔐 Segurança

### ⚠️ Considerações Importantes

1. **API Key no Frontend**
   - A API Key está exposta no HTML (meta tag)
   - Isso é aceitável para APIs que permitem uso client-side
   - Configure restrições de domínio no dashboard EvoPay

2. **Para Produção**
   - Considere usar um backend proxy
   - Não exponha API Keys com permissões administrativas
   - Use API Keys separadas para dev/staging/production

3. **Monitoramento**
   - Monitore uso da API no dashboard
   - Configure alertas para transações suspeitas
   - Revise logs regularmente

---

## 📞 Suporte

### Documentação EvoPay
- Site: https://evopay.cash
- Dashboard: https://dashboard.evopay.cash
- Docs: https://docs.evopay.cash
- API Reference: https://docs.evopay.cash/api

### Suporte Técnico
- Email: suporte@evopay.cash
- WhatsApp: (confira no dashboard)

---

## 🎉 Próximos Passos

Agora que a integração está configurada:

1. ✅ Teste com pagamentos reais pequenos (R$ 0,01)
2. ✅ Configure webhooks para confirmação automática
3. ✅ Personalize mensagens de erro
4. ✅ Adicione analytics para conversão
5. ✅ Configure backup da API Key

---

**Criado em:** 04/11/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para uso

