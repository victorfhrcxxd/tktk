# 📤 UPLOAD COMPLETO - O Que Precisa Ser Enviado

## ❌ Problema Atual

O código no servidor está desatualizado. O arquivo `evopay-integration.js` precisa ser atualizado para incluir o sistema de fallback.

---

## ✅ ARQUIVOS PARA UPLOAD

### **1. PROXY PHP (OBRIGATÓRIO)**

**Localização no seu computador:**
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/proxy.php
```

**Onde fazer upload no servidor:**
```
/api/evopay/proxy.php
```

**Como fazer:**
1. Crie a pasta: `/api/evopay/`
2. Faça upload de `proxy.php`

---

### **2. CÓDIGO JAVASCRIPT ATUALIZADO (OBRIGATÓRIO)**

**Localização no seu computador:**
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/js/evopay-integration.js
```

**Onde fazer upload no servidor:**
```
/js/evopay-integration.js
```

**IMPORTANTE:** Substitua o arquivo antigo pelo novo!

---

### **3. ARQUIVO .HTACCESS (RECOMENDADO)**

**Localização no seu computador:**
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/htaccess.txt
```

**Onde fazer upload no servidor:**
```
/.htaccess
```

**Como fazer:**
1. Faça upload de `htaccess.txt`
2. Renomeie para `.htaccess`

---

## 📋 CHECKLIST COMPLETO

### **Upload de Arquivos:**
- [ ] `/api/evopay/proxy.php` ← Upload este!
- [ ] `/js/evopay-integration.js` ← **ATUALIZE este!**
- [ ] `/.htaccess` ← Upload este!

### **Verificação:**
- [ ] Teste: `https://tkttok.shop/api/evopay/test.php` funciona
- [ ] Teste: `https://tkttok.shop/api/evopay/account/balance` retorna JSON
- [ ] Teste: `https://tkttok.shop/payment` não dá 404
- [ ] Console não mostra mais erro 404

---

## 🚨 IMPORTANTE

### **O arquivo `evopay-integration.js` foi atualizado!**

O novo arquivo inclui:
- ✅ Sistema de fallback automático
- ✅ Tenta API direta se proxy não existir
- ✅ Mensagens de erro melhoradas

**Você precisa fazer upload da versão atualizada!**

---

## 📁 ESTRUTURA FINAL NO SERVIDOR

```
tkttok.shop/
├── .htaccess                    ← Upload htaccess.txt e renomeie
├── index.html
├── js/
│   └── evopay-integration.js    ← ATUALIZE ESTE ARQUIVO!
├── css/
├── assets/
├── images/
├── admin/
└── api/
    └── evopay/
        ├── proxy.php            ← Upload este!
        ├── test.php
        └── index.php
```

---

## 🔍 Como Verificar se Está Atualizado

Após fazer upload, abra o console (F12) e procure por:

✅ **Se estiver atualizado:**
```
EvoPay: Proxy não encontrado (404) para /account/balance, tentando API direta...
EvoPay: API direta funcionou! Upload do proxy PHP ainda é recomendado para evitar CORS.
```

❌ **Se não estiver atualizado:**
```
GET https://tkttok.shop/api/evopay/account/balance 404 (Not Found)
EvoPay: Erro ao inicializar: Error: Erro ao buscar saldo: 404
```

---

## ⚡ AÇÃO NECESSÁRIA

1. **Faça upload do novo `evopay-integration.js`** (substitua o antigo)
2. **Faça upload do `proxy.php`** para `/api/evopay/`
3. **Faça upload do `.htaccess`**

Após isso, o site deve funcionar! ✅

---

**🚨 Lembre-se: O código JavaScript precisa ser atualizado no servidor!**

