# 🚨 URGENTE: Upload do Proxy PHP Necessário

## ❌ Problema Atual

O site está retornando **404** para todas as requisições da API EvoPay:
```
GET https://tkttok.shop/api/evopay/account/balance 404 (Not Found)
```

**Causa:** O arquivo proxy PHP não foi feito upload para o servidor.

---

## ✅ Solução Imediata

### **Passo 1: Criar a Pasta no Servidor**

Via FTP/SSH, crie a pasta:
```
/api/evopay/
```

### **Passo 2: Upload dos Arquivos**

Faça upload destes arquivos para `/api/evopay/`:

1. ✅ `proxy.php` - **OBRIGATÓRIO**
2. ✅ `test.php` - Para testar (opcional)
3. ✅ `index.php` - Alternativa se proxy.php não funcionar
4. ✅ `.htaccess` - Para Apache (opcional)

### **Passo 3: Verificar Upload**

Acesse no navegador:
```
https://tkttok.shop/api/evopay/test.php
```

**Deve mostrar:** Página de teste com informações do servidor

### **Passo 4: Testar o Proxy**

Acesse:
```
https://tkttok.shop/api/evopay/account/balance
```

**Deve retornar:** JSON com saldo da conta
```json
{"balance": ..., "eligibleWithdraw": ...}
```

---

## 📁 Estrutura no Servidor

```
tkttok.shop/
├── index.html
├── css/
├── js/
├── assets/
├── images/
├── admin/
└── api/
    └── evopay/
        ├── proxy.php      ← UPLOAD ESTE!
        ├── test.php       ← Teste (opcional)
        ├── index.php      ← Alternativa
        └── .htaccess      ← Opcional
```

---

## 🔍 Verificação Rápida

### **Opção 1: Via Navegador**

1. Acesse: `https://tkttok.shop/api/evopay/test.php`
2. Clique em "Testar Conexão"
3. Deve mostrar resultado

### **Opção 2: Via cURL**

```bash
curl https://tkttok.shop/api/evopay/account/balance
```

**Deve retornar:** JSON com saldo

---

## 🐛 Se Ainda Der 404

### **Verifique:**

1. ✅ Arquivo existe em `/api/evopay/proxy.php`?
2. ✅ Permissões corretas? (chmod 644)
3. ✅ Servidor suporta PHP?
4. ✅ Estrutura de pastas está correta?

### **Alternativa: Usar index.php**

Se `proxy.php` não funcionar:

1. Renomeie `index.php` para `proxy.php`
2. Ou configure o servidor para usar `index.php` como padrão

---

## 📝 Arquivos para Upload

Todos os arquivos estão em:
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/
```

**Faça upload de TODA a pasta `api/evopay/` para o servidor!**

---

## ⚡ Após o Upload

1. **Recarregue a página:** `https://tkttok.shop`
2. **Abra o Console (F12)**
3. **Procure por:** `EvoPay: Modo produção detectado`
4. **Não deve mais aparecer erro 404** ✅

---

## 🆘 Se Precisar de Ajuda

1. Verifique se o arquivo existe: `https://tkttok.shop/api/evopay/proxy.php`
2. Teste com: `https://tkttok.shop/api/evopay/test.php`
3. Verifique logs de erro do servidor

---

**🚨 AÇÃO NECESSÁRIA: Fazer upload do proxy PHP AGORA!**

