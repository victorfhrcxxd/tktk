# 🔴 Erro 404: Proxy PHP Não Encontrado

## ❌ Problema Identificado

O site está tentando acessar:
```
https://tkttok.shop/api/evopay/account/balance
```

Mas está retornando **404 (Not Found)** porque o arquivo proxy PHP não existe no servidor.

---

## ✅ Solução

### **AÇÃO NECESSÁRIA: Upload do Proxy PHP**

Faça upload da pasta `api/evopay/` para o servidor:

1. **Conecte-se ao servidor** (FTP, SSH, cPanel, etc.)
2. **Navegue até a raiz do site** (onde está o `index.html`)
3. **Crie a pasta:** `/api/evopay/`
4. **Faça upload dos arquivos:**
   - `proxy.php` ← **OBRIGATÓRIO**
   - `test.php` ← Para testar
   - `index.php` ← Alternativa
   - `.htaccess` ← Opcional (Apache)

---

## 📁 Localização dos Arquivos

No seu computador:
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/
├── proxy.php
├── test.php
├── index.php
└── .htaccess
```

**Upload TODA a pasta `api/evopay/` para o servidor!**

---

## ✅ Verificação

Após o upload, teste:

### **1. Teste do Arquivo de Teste**
```
https://tkttok.shop/api/evopay/test.php
```
**Deve mostrar:** Página de teste com informações

### **2. Teste do Proxy Direto**
```
https://tkttok.shop/api/evopay/account/balance
```
**Deve retornar:** JSON com saldo da conta

### **3. Teste no Site**
1. Acesse: `https://tkttok.shop`
2. Abra Console (F12)
3. **Não deve mais aparecer erro 404** ✅

---

## 🐛 Se Ainda Der 404

### **Verifique:**

1. ✅ Arquivo existe? `https://tkttok.shop/api/evopay/proxy.php`
2. ✅ Permissões corretas? (644 ou 755)
3. ✅ Estrutura de pastas correta?
4. ✅ Servidor suporta PHP?

### **Alternativas:**

1. **Tente usar `index.php`** em vez de `proxy.php`
2. **Configure `.htaccess`** se usar Apache
3. **Verifique logs de erro** do servidor

---

## 📝 Checklist

- [ ] Pasta `/api/evopay/` criada no servidor
- [ ] Arquivo `proxy.php` uploadado
- [ ] Teste: `https://tkttok.shop/api/evopay/test.php` funciona
- [ ] Teste: `https://tkttok.shop/api/evopay/account/balance` retorna JSON
- [ ] Site não mostra mais erro 404

---

## 🚀 Após Upload Correto

O código JavaScript detectará automaticamente e usará:
```
https://tkttok.shop/api/evopay
```

E todas as requisições funcionarão normalmente! ✅

---

**URGENTE: Fazer upload do proxy PHP para resolver o erro 404!**

