# 🚀 Configuração para Produção (Hospedagem)

## 🎯 Problema Identificado

Em produção, o sistema estava tentando usar `localhost:8001` (proxy local), que não funciona em servidores de hospedagem.

## ✅ Solução Implementada

O sistema agora detecta automaticamente se está em **produção** ou **desenvolvimento**:

### 🔄 Modo Automático

- **Desenvolvimento** (localhost, 127.0.0.1, 192.168.x.x): Usa proxy local
- **Produção** (domínio real): Usa API direta da EvoPay

---

## 📋 Configuração Manual (Opcional)

Se o auto-detect não funcionar, você pode configurar manualmente:

### Opção 1: Via Meta Tag no HTML

Edite o `index.html` e altere a meta tag:

```html
<!-- Para Produção (API Direta) -->
<meta name="evopay-api-url" content="https://pix.evopay.cash/v1">

<!-- Para Desenvolvimento (Proxy Local) -->
<meta name="evopay-api-url" content="http://localhost:8001">
```

### Opção 2: Via JavaScript (antes de carregar o script)

Adicione no `index.html` antes do script do EvoPay:

```html
<script>
  window.EVOPAY_API_URL = 'https://pix.evopay.cash/v1';
</script>
```

---

## 🔧 Como Funciona

### Em Desenvolvimento:
```
localhost:8000 → localhost:8001 (proxy) → pix.evopay.cash/v1
```

### Em Produção:
```
seudominio.com → pix.evopay.cash/v1 (direto)
```

---

## ⚠️ IMPORTANTE: CORS em Produção

Se você receber erro de CORS em produção, a API EvoPay não permite requisições diretas do navegador. Você precisará criar um proxy.

### ✅ Solução Rápida: Proxy PHP (Hospedagem Compartilhada)

1. **Faça upload do arquivo `proxy-evopay.php`** para:
   ```
   /api/evopay/proxy.php
   ```

2. **Configure no `index.html`:**
   ```html
   <meta name="evopay-api-url" content="https://seudominio.com/api/evopay">
   ```

3. **Pronto!** O proxy resolverá o CORS automaticamente.

### ✅ Solução Avançada: Proxy Node.js (VPS/Servidor)

1. **Use o arquivo `proxy-evopay-producao.js`**

2. **Instale dependências:**
   ```bash
   npm install express node-fetch cors
   ```

3. **Inicie o servidor:**
   ```bash
   node proxy-evopay-producao.js
   ```

4. **Configure no `index.html`:**
   ```html
   <meta name="evopay-api-url" content="https://seudominio.com/api/evopay">
   ```

### 📋 Estrutura de Diretórios

```
seu-site/
├── index.html
├── api/
│   └── evopay/
│       └── proxy.php  ← Upload este arquivo
└── ...
```

**URL do proxy:** `https://seudominio.com/api/evopay`

---

## 🧪 Teste em Produção

1. **Faça upload do site** para sua hospedagem
2. **Acesse o site** pelo domínio
3. **Abra o console** (F12)
4. **Procure por esta mensagem:**
   ```
   EvoPay: Modo produção detectado, usando API direta: https://pix.evopay.cash/v1
   ```

Se aparecer essa mensagem = **Funcionando!** ✅

---

## 📊 Checklist de Deploy

- [ ] Site funcionando na hospedagem
- [ ] Console mostra "Modo produção detectado"
- [ ] Teste criar um PIX
- [ ] Verifique se o QR Code aparece
- [ ] Teste se o pagamento funciona

---

## 🔍 Troubleshooting

### Erro: "CORS policy"

**Solução:** A API EvoPay não permite CORS direto. Você precisa:
1. Criar um proxy no seu servidor, OU
2. Fazer as chamadas via backend

### Erro: "Failed to fetch"

**Solução:** Verifique:
1. Se a URL da API está correta
2. Se sua hospedagem permite requests externos
3. Se o firewall não está bloqueando

### QR Code não aparece

**Solução:** 
1. Verifique o console para erros
2. Confirme que a API retornou o QR Code
3. Verifique se o formato base64 está correto

---

## 💡 Dica Pro

Para testar em produção localmente antes de fazer deploy:

1. Adicione ao `/etc/hosts`:
   ```
   127.0.0.1 seudominio.com
   ```

2. Acesse: `http://seudominio.com:8000`
3. O sistema detectará como produção e usará a API direta

---

**Configuração automática funcionando!** 🎉

