# 📱 Correção: Erro de Pagamento no Mobile

## 🐛 Problema Identificado

Erros de pagamento ocorrendo especificamente em dispositivos móveis, possivelmente devido a:
- Timeout de conexão mais curto
- Problemas de CORS em mobile
- Erros de rede não tratados adequadamente
- Falta de logs detalhados para debugging

## ✅ Soluções Implementadas

### 1. **Timeout Maior para Mobile**
- ✅ Desktop: 15 segundos
- ✅ Mobile: 30 segundos (dobro do tempo)
- ✅ Fallback para browsers sem AbortController

### 2. **Mensagens de Erro Amigáveis**
- ✅ "Erro de conexão. Verifique sua internet..."
- ✅ "Tempo de conexão esgotado..."
- ✅ Mensagens específicas para cada tipo de erro

### 3. **Logs Detalhados**
- ✅ Detecta se é mobile
- ✅ Loga User Agent
- ✅ Loga detalhes do erro
- ✅ Loga informações de debugging

### 4. **Melhor Tratamento de Erros**
- ✅ Captura erros de rede
- ✅ Captura erros de timeout
- ✅ Captura erros de CORS
- ✅ Retorna mensagens claras

### 5. **Headers CORS Melhorados**
- ✅ Access-Control-Allow-Origin: *
- ✅ Headers adicionais no interceptor

---

## 🔧 Mudanças no Código

### `createPixPayment()` - Antes
```javascript
const response = await fetch(`${this.apiUrl}/pix`, {
  method: 'POST',
  // Sem timeout
  // Sem tratamento de erro específico
});
```

### `createPixPayment()` - Depois
```javascript
// Timeout maior para mobile
const timeout = isMobile ? 30000 : 15000;
const controller = new AbortController();

const response = await fetch(`${this.apiUrl}/pix`, {
  method: 'POST',
  signal: controller.signal, // Timeout automático
  // ...headers e body
});
```

### `handleCreatePayment()` - Melhorias
```javascript
// Logs detalhados
console.log('EvoPay: Criando pagamento (mobile-friendly)...', {
  isMobile: /Android|iPhone/.test(navigator.userAgent),
  userAgent: navigator.userAgent
});

// Headers CORS
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
```

---

## 📊 Como Diagnosticar no Mobile

### 1. Abra o Console do Navegador Mobile

**Android Chrome:**
1. Abra `chrome://inspect` no desktop
2. Conecte o celular via USB
3. Ative "Debugging USB" no celular
4. Selecione o dispositivo

**iOS Safari:**
1. No Mac: Safari → Preferências → Avançado → "Mostrar menu Desenvolver"
2. No iPhone: Configurações → Safari → Avançado → "Web Inspector"
3. Conecte via USB
4. No Mac: Safari → Desenvolver → [Seu iPhone] → [Página]

### 2. Verifique os Logs

Procure por estas mensagens no console:
```
EvoPay: Criando pagamento (mobile-friendly)...
EvoPay: Pagamento criado com sucesso!
EvoPay: Erro ao criar pagamento: ...
```

### 3. Verifique o Erro Específico

Os logs agora mostram:
- ✅ Se é mobile
- ✅ User Agent
- ✅ Tipo de erro
- ✅ Mensagem detalhada

---

## 🧪 Teste Agora

### Passo 1: Recarregue a Página
```
Ctrl + Shift + R (Desktop)
Cmd + Shift + R (Mac)
```

No mobile: Feche e reabra o app/navegador

### Passo 2: Tente Gerar um PIX
1. Escolha um produto
2. Clique em "Comprar agora"
3. Preencha os dados
4. Clique em "Gerar PIX"

### Passo 3: Verifique o Console
- Se der erro, verifique os logs detalhados
- Copie a mensagem de erro completa
- Verifique se mostra "isMobile: true"

---

## 📱 Erros Comuns no Mobile

| Erro | Causa | Solução |
|------|-------|---------|
| "Failed to fetch" | Sem internet | Verifique conexão |
| "Tempo de conexão esgotado" | Timeout | Já aumentado para 30s |
| "CORS policy" | Problema de servidor | Verifique proxy |
| "NetworkError" | Problema de rede | Verifique conexão |

---

## 🔍 Debugging Avançado

### Verificar se o Proxy está Acessível

No mobile, teste:
```javascript
fetch('http://192.168.0.204:8001/account/balance')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Verificar API Key

```javascript
document.querySelector('meta[name="evopay-api-key"]').content
```

Deve retornar: `5aef8004-9644-4dda-85a4-163fae7439ae`

### Verificar URL da API

```javascript
document.querySelector('meta[name="evopay-api-url"]').content
```

Deve retornar: `http://localhost:8001` (ou IP da rede)

---

## ⚠️ IMPORTANTE: IP da Rede

Se estiver testando no mobile na mesma rede:

1. **Descubra o IP do computador:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **Use o IP em vez de localhost:**
   - ❌ `http://localhost:8001`
   - ✅ `http://192.168.0.204:8001`

3. **Atualize a meta tag:**
   ```html
   <meta name="evopay-api-url" content="http://192.168.0.204:8001">
   ```

---

## 🚀 Próximos Passos (Se Ainda Houver Erro)

1. **Copie os logs completos do console**
2. **Verifique se é mobile**: Procure por `isMobile: true`
3. **Verifique o erro específico**: Mensagem completa
4. **Verifique conexão**: Teste se o proxy está acessível
5. **Verifique IP**: Use IP da rede em vez de localhost

---

## 📝 Checklist de Teste

- [ ] Página recarregada
- [ ] Console aberto (F12 ou DevTools)
- [ ] Teste gerando um PIX
- [ ] Verifique logs no console
- [ ] Se houver erro, copie mensagem completa
- [ ] Verifique se mostra "isMobile: true"
- [ ] Verifique conexão com internet
- [ ] Verifique se proxy está rodando

---

**Correções aplicadas! Agora teste no mobile e verifique os logs detalhados!** 📱

