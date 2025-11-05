# 🚨 URGENTE: Upload do Proxy PHP Necessário

## ❌ Situação Atual

O site está tentando usar o proxy PHP, mas ele não existe no servidor:
```
GET https://tkttok.shop/api/evopay/account/balance → 404 (Not Found)
```

**Isso impede o sistema de pagamento de funcionar!**

---

## ✅ SOLUÇÃO: Upload do Proxy PHP

### **Onde está o arquivo:**

No seu computador:
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/proxy.php
```

### **Onde fazer upload:**

No servidor:
```
/api/evopay/proxy.php
```

### **Como fazer upload:**

#### **Opção 1: Via FTP (FileZilla, Cyberduck, etc.)**

1. Conecte-se ao servidor
2. Navegue até a raiz do site (mesma pasta do `index.html`)
3. Crie a pasta: `api/evopay/`
4. Faça upload de `proxy.php` para `api/evopay/proxy.php`

#### **Opção 2: Via cPanel File Manager**

1. Abra o File Manager
2. Vá para a raiz do site
3. Crie a pasta: `api` → dentro dela crie `evopay`
4. Faça upload de `proxy.php` para `api/evopay/proxy.php`

#### **Opção 3: Via SSH/Terminal**

```bash
# Conecte-se ao servidor
ssh usuario@tkttok.shop

# Navegue até a raiz do site
cd /var/www/html  # ou o caminho do seu site

# Crie a pasta
mkdir -p api/evopay

# Copie o arquivo (ajuste o caminho)
scp /caminho/local/api/evopay/proxy.php usuario@tkttok.shop:/var/www/html/api/evopay/

# Ou crie o arquivo diretamente
nano api/evopay/proxy.php
# Cole o conteúdo do proxy.php
```

---

## ✅ Verificação

Após fazer upload, teste:

### **1. Teste do Arquivo:**
```
https://tkttok.shop/api/evopay/test.php
```
**Deve mostrar:** Página de teste com informações do servidor

### **2. Teste da API:**
```
https://tkttok.shop/api/evopay/account/balance
```
**Deve retornar:** JSON com saldo
```json
{"balance": ..., "eligibleWithdraw": ...}
```

### **3. Teste no Site:**
1. Acesse: `https://tkttok.shop`
2. Abra Console (F12)
3. **Não deve mais aparecer erro 404** ✅

---

## 📁 Estrutura Correta no Servidor

```
tkttok.shop/
├── index.html
├── .htaccess
├── css/
├── js/
├── assets/
├── images/
├── admin/
└── api/
    └── evopay/
        ├── proxy.php      ← ESTE ARQUIVO!
        ├── test.php
        └── index.php
```

---

## 🐛 Se Ainda Der 404

### **Verifique:**

1. ✅ Arquivo existe? `https://tkttok.shop/api/evopay/proxy.php`
2. ✅ Estrutura correta? `/api/evopay/proxy.php` (não `/api/evopay/proxy/proxy.php`)
3. ✅ Permissões? (chmod 644 ou 755)
4. ✅ Servidor suporta PHP?

### **Teste Rápido:**

Acesse no navegador:
```
https://tkttok.shop/api/evopay/proxy.php
```

**Se retornar:** JSON (mesmo que erro) = arquivo existe ✅
**Se retornar:** 404 = arquivo não existe ❌

---

## ⚠️ Nota Importante

O código agora tem um **fallback temporário** que tenta usar a API direta se o proxy não existir. No entanto:

- ❌ Pode dar erro de CORS (depende da configuração da API)
- ❌ Não é uma solução permanente
- ✅ Upload do proxy é **obrigatório** para funcionar corretamente

---

## 📝 Checklist

- [ ] Conectei ao servidor
- [ ] Criei pasta `/api/evopay/`
- [ ] Fiz upload de `proxy.php`
- [ ] Testei: `https://tkttok.shop/api/evopay/test.php` funciona
- [ ] Testei: `https://tkttok.shop/api/evopay/account/balance` retorna JSON
- [ ] Site não mostra mais erro 404

---

**🚨 AÇÃO NECESSÁRIA: Fazer upload do proxy.php AGORA!**

O sistema de pagamento não funcionará completamente até que o proxy seja feito upload.

