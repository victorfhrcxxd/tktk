# 🚨 INSTRUÇÕES FINAIS - UPLOAD DO PROXY PHP

## ❌ PROBLEMA ATUAL

O site está retornando **404** para todas as requisições:
- `https://tkttok.shop/api/evopay/account/balance` → **404**
- `https://tkttok.shop/api/evopay/pix` → **404**
- `https://tkttok.shop/api/evopay/account/transactions` → **404**

**Causa:** O arquivo proxy PHP não existe no servidor.

---

## ✅ SOLUÇÃO (OBRIGATÓRIA)

### **PASSO 1: Localizar os Arquivos**

No seu computador, navegue até:
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/
```

Você encontrará:
- ✅ `proxy.php` - **OBRIGATÓRIO**
- ✅ `test.php` - Para testar
- ✅ `index.php` - Alternativa
- ✅ `.htaccess` - Opcional (Apache)

### **PASSO 2: Conectar ao Servidor**

Use uma das opções:
- **FTP** (FileZilla, Cyberduck, etc.)
- **SSH** (Terminal, Putty, etc.)
- **cPanel File Manager**
- **Painel de controle da hospedagem**

### **PASSO 3: Criar a Estrutura**

No servidor, crie a pasta:
```
/api/evopay/
```

**Localização:** Na mesma pasta onde está o `index.html`

### **PASSO 4: Fazer Upload**

Faça upload de **TODOS** os arquivos da pasta `api/evopay/`:
- `proxy.php` ← **MAIS IMPORTANTE**
- `test.php`
- `index.php`
- `.htaccess`

---

## ✅ VERIFICAÇÃO

### **Teste 1: Verificar se Arquivo Existe**

Acesse no navegador:
```
https://tkttok.shop/api/evopay/test.php
```

**Se funcionar:** Mostrará página de teste ✅
**Se der 404:** Arquivo não foi feito upload ❌

### **Teste 2: Testar o Proxy**

Acesse:
```
https://tkttok.shop/api/evopay/account/balance
```

**Se funcionar:** Retornará JSON com saldo ✅
**Se der 404:** Arquivo não existe ou está em local errado ❌

### **Teste 3: Verificar no Site**

1. Acesse: `https://tkttok.shop`
2. Abra Console (F12)
3. **Não deve mais aparecer erro 404** ✅

---

## 🐛 TROUBLESHOOTING

### ❌ Ainda dá 404

**Verifique:**

1. ✅ Arquivo existe? `https://tkttok.shop/api/evopay/proxy.php`
2. ✅ Estrutura correta? `/api/evopay/proxy.php` (não `/api/evopay/proxy/proxy.php`)
3. ✅ Permissões corretas? (chmod 644 ou 755)
4. ✅ Servidor suporta PHP?

### ❌ Erro 500

**Causa:** Erro no código PHP ou cURL não habilitado

**Solução:**
- Verifique logs de erro do PHP
- Verifique se cURL está habilitado: `php -m | grep curl`
- Verifique API Key no arquivo `proxy.php`

### ❌ Não encontra arquivo

**Alternativas:**

1. **Tente usar `index.php`** em vez de `proxy.php`
2. **Configure `.htaccess`** se usar Apache
3. **Verifique se o servidor usa reescrita de URLs**

---

## 📁 ESTRUTURA CORRETA NO SERVIDOR

```
tkttok.shop/
├── index.html          ← Seu site principal
├── css/
├── js/
├── assets/
├── images/
├── admin/
└── api/
    └── evopay/
        ├── proxy.php   ← DEVE ESTAR AQUI!
        ├── test.php
        ├── index.php
        └── .htaccess
```

---

## 📝 CHECKLIST

- [ ] Conectei ao servidor
- [ ] Criei pasta `/api/evopay/`
- [ ] Fiz upload de `proxy.php`
- [ ] Fiz upload de `test.php`
- [ ] Testei: `https://tkttok.shop/api/evopay/test.php` funciona
- [ ] Testei: `https://tkttok.shop/api/evopay/account/balance` retorna JSON
- [ ] Site não mostra mais erro 404

---

## 🚀 APÓS O UPLOAD

O código JavaScript detectará automaticamente:
```
EvoPay: Modo produção detectado, usando proxy PHP: https://tkttok.shop/api/evopay
```

E todas as requisições funcionarão normalmente! ✅

---

## 📞 SE PRECISAR DE AJUDA

1. Verifique se o arquivo existe: `https://tkttok.shop/api/evopay/proxy.php`
2. Teste com: `https://tkttok.shop/api/evopay/test.php`
3. Verifique logs de erro do servidor
4. Verifique se o servidor suporta PHP

---

**🚨 AÇÃO NECESSÁRIA: Fazer upload do proxy PHP AGORA!**

O site não funcionará até que o proxy seja feito upload.

