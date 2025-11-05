# ✅ Configuração para Produção: tkttok.shop

## 🎯 Domínio Configurado

Site configurado para funcionar em produção no domínio: **https://tkttok.shop/**

---

## ✅ Mudanças Aplicadas

### 1. **Open Graph (Facebook/Redes Sociais)**
- ✅ URL atualizada: `https://tkttok.shop/`
- ✅ Meta tags de compartilhamento configuradas

### 2. **Twitter Cards**
- ✅ URL atualizada: `https://tkttok.shop/`
- ✅ Cards de compartilhamento configurados

### 3. **Structured Data (JSON-LD)**
- ✅ URL atualizada: `https://tkttok.shop`
- ✅ Busca configurada: `https://tkttok.shop/search?q={search_term_string}`

### 4. **EvoPay API (Automático)**
- ✅ Detecção automática de produção
- ✅ Em produção: usa `https://pix.evopay.cash/v1` diretamente
- ✅ Callback URL: `https://tkttok.shop/payment-callback` (automático)

---

## 🔧 Como Funciona

### **Detecção Automática de Ambiente**

O sistema detecta automaticamente se está em produção ou desenvolvimento:

| Ambiente | Hostname | API URL Usada |
|----------|----------|--------------|
| **Desenvolvimento** | `localhost`, `127.0.0.1`, `192.168.x.x` | `http://localhost:8001` (proxy) |
| **Produção** | `tkttok.shop` ou qualquer outro domínio | `https://pix.evopay.cash/v1` (direto) |

### **Callback URL Automático**

O `callbackUrl` é configurado automaticamente usando `window.location.origin`:
- Desenvolvimento: `http://localhost:8000/payment-callback`
- Produção: `https://tkttok.shop/payment-callback`

---

## 📤 Deploy para Produção

### **1. Upload dos Arquivos**

Faça upload de todos os arquivos para o servidor de hospedagem:
```
/
├── index.html
├── css/
├── js/
├── assets/
├── images/
└── admin/
```

### **2. Configuração do Servidor**

#### **Se usar Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### **Se usar Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### **3. Verificação**

Após o deploy, acesse: **https://tkttok.shop/**

Abra o console (F12) e verifique:
- ✅ `EvoPay: Modo produção detectado, usando API direta: https://pix.evopay.cash/v1`
- ✅ Sem erros de CORS
- ✅ PIX gerando corretamente

---

## 🔍 Se Der Erro de CORS

Se a API EvoPay não permitir CORS direto, você tem 2 opções:

### **Opção 1: Proxy PHP (Recomendado para Hospedagem Compartilhada)**

1. Faça upload do arquivo `proxy-evopay.php` para:
   ```
   /api/evopay/proxy.php
   ```

2. Atualize o `index.html`:
   ```html
   <meta name="evopay-api-url" content="https://tkttok.shop/api/evopay">
   ```

3. Pronto! ✅

### **Opção 2: Proxy Node.js (Para VPS/Servidor)**

1. Use o arquivo `proxy-evopay-producao.js`
2. Configure como serviço (PM2, systemd, etc.)
3. Aponte a URL para o proxy

---

## 📊 Checklist de Deploy

- [x] URLs Open Graph atualizadas para `tkttok.shop`
- [x] URLs Twitter Cards atualizadas para `tkttok.shop`
- [x] Structured Data (JSON-LD) atualizado
- [x] EvoPay API configurado para detecção automática
- [x] Callback URL configurado automaticamente
- [ ] Arquivos enviados para o servidor
- [ ] Servidor configurado (Apache/Nginx)
- [ ] Teste de geração de PIX funcionando
- [ ] Teste de verificação de status funcionando
- [ ] Admin panel acessível em `/admin/`

---

## 🚀 Status

✅ **Site configurado e pronto para produção!**

O sistema detectará automaticamente que está em produção quando acessado via `https://tkttok.shop/` e usará a API direta da EvoPay, sem necessidade de proxy.

---

**Última atualização:** Configuração aplicada para `tkttok.shop`

