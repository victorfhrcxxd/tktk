# 🔧 Solução: Erro de CORS em Produção

## ❌ Problema

A API EvoPay não permite requisições CORS diretas do navegador. Em produção (`https://tkttok.shop`), você estava recebendo:

```
Access to fetch at 'https://pix.evopay.cash/v1/pix' from origin 'https://tkttok.shop' 
has been blocked by CORS policy
```

## ✅ Solução Implementada

### **1. Proxy PHP no Servidor**

O sistema agora usa automaticamente um proxy PHP no mesmo domínio em produção:
- **Desenvolvimento**: `http://localhost:8001` (proxy Python)
- **Produção**: `https://tkttok.shop/api/evopay` (proxy PHP)

### **2. Detecção Automática**

O código JavaScript detecta automaticamente o ambiente:
- Se não é `localhost` ou IP local → **Produção**
- Em produção, usa automaticamente o proxy PHP

---

## 📤 Como Configurar no Servidor

### **Passo 1: Criar a Pasta**

No servidor de hospedagem, crie a estrutura:
```
/
├── api/
│   └── evopay/
│       └── proxy.php  ← Faça upload deste arquivo
```

### **Passo 2: Upload do Proxy**

Faça upload do arquivo `proxy-evopay.php` para:
```
/api/evopay/proxy.php
```

### **Passo 3: Verificar Permissões**

Certifique-se de que o arquivo PHP tem permissões de execução:
```bash
chmod 644 /api/evopay/proxy.php
```

### **Passo 4: Testar o Proxy**

Acesse no navegador:
```
https://tkttok.shop/api/evopay/account/balance
```

**Deve retornar:**
```json
{"balance": ...}
```

Se retornar erro 404, verifique:
- ✅ Arquivo existe em `/api/evopay/proxy.php`
- ✅ Estrutura de pastas está correta
- ✅ Servidor suporta PHP

---

## 🔍 Como Funciona

### **Fluxo em Produção:**

```
1. Usuário acessa: https://tkttok.shop
                    ↓
2. JavaScript detecta produção
                    ↓
3. Usa: https://tkttok.shop/api/evopay
                    ↓
4. Proxy PHP recebe requisição
                    ↓
5. Proxy faz requisição para: https://pix.evopay.cash/v1
                    ↓
6. Retorna resposta com CORS headers
                    ↓
7. Navegador recebe resposta sem erro CORS ✅
```

### **Código Atualizado:**

O `evopay-integration.js` agora detecta produção e usa:
```javascript
// Em produção
const productionUrl = `${protocol}//${currentHost}/api/evopay`;
// Resultado: https://tkttok.shop/api/evopay
```

---

## ✅ Verificação

Após fazer upload do proxy, verifique no console do navegador:

1. **Acesse:** `https://tkttok.shop`
2. **Abra o Console (F12)**
3. **Procure por:**
   ```
   EvoPay: Modo produção detectado, usando proxy PHP: https://tkttok.shop/api/evopay
   EvoPay: O proxy PHP resolve problemas de CORS automaticamente
   ```

4. **Teste gerar um PIX:**
   - Não deve mais aparecer erro de CORS
   - QR Code deve aparecer normalmente

---

## 🐛 Troubleshooting

### Erro 404 no Proxy

**Sintoma:** `GET https://tkttok.shop/api/evopay/account/balance 404`

**Solução:**
1. Verifique se o arquivo existe: `/api/evopay/proxy.php`
2. Verifique a estrutura de pastas
3. Teste acesso direto: `https://tkttok.shop/api/evopay/proxy.php`

### Erro 500 no Proxy

**Sintoma:** `GET https://tkttok.shop/api/evopay/account/balance 500`

**Solução:**
1. Verifique logs de erro do PHP
2. Verifique se cURL está habilitado no PHP
3. Verifique se a API Key está correta no `proxy.php`

### Ainda dando erro de CORS

**Sintoma:** Continua bloqueando CORS mesmo com proxy

**Solução:**
1. Verifique se o proxy está retornando headers CORS:
   ```php
   header('Access-Control-Allow-Origin: *');
   ```
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique se está usando HTTPS em produção

---

## 📝 Estrutura Final no Servidor

```
tkttok.shop/
├── index.html
├── css/
├── js/
│   └── evopay-integration.js  ← Já atualizado
├── assets/
├── images/
├── admin/
└── api/
    └── evopay/
        └── proxy.php  ← NOVO! Precisa fazer upload
```

---

## 🚀 Status

✅ **Código atualizado para usar proxy PHP em produção**
✅ **Detecção automática de ambiente**
✅ **Proxy PHP pronto para upload**

**Próximo passo:** Faça upload do `proxy-evopay.php` para `/api/evopay/proxy.php` no servidor!

---

**Última atualização:** Correção de CORS em produção implementada

