# 📤 Guia: Upload do Proxy PHP para Produção

## 🎯 Objetivo

Resolver o erro de CORS em produção fazendo upload do proxy PHP para o servidor.

---

## 📁 Estrutura de Pastas no Servidor

Crie esta estrutura no servidor de hospedagem:

```
public_html/  (ou htdocs/ ou www/)
├── index.html
├── css/
├── js/
├── assets/
├── images/
├── admin/
└── api/
    └── evopay/
        ├── proxy.php      ← Opção 1
        ├── index.php      ← Opção 2 (alternativa)
        └── .htaccess      ← Opcional (para Apache)
```

---

## 🔧 Opção 1: Usando proxy.php (Recomendado)

### **Passo 1: Criar a Pasta**

No servidor, crie:
```
/api/evopay/
```

### **Passo 2: Upload do Arquivo**

Faça upload do arquivo `proxy-evopay.php` para:
```
/api/evopay/proxy.php
```

### **Passo 3: Verificar**

Acesse no navegador:
```
https://tkttok.shop/api/evopay/proxy.php
```

**Deve retornar:** JSON com erro 404 (normal, pois não passou path)

---

## 🔧 Opção 2: Usando index.php (Alternativa)

Se `proxy.php` não funcionar, use esta alternativa:

### **Passo 1: Criar a Pasta**

No servidor, crie:
```
/api/evopay/
```

### **Passo 2: Upload do Arquivo**

Faça upload do arquivo `api/evopay/index.php` para:
```
/api/evopay/index.php
```

### **Passo 3: Upload do .htaccess (Opcional)**

Se o servidor for Apache, faça upload também:
```
/api/evopay/.htaccess
```

### **Passo 4: Verificar**

Acesse no navegador:
```
https://tkttok.shop/api/evopay/
```

---

## ✅ Teste do Proxy

Após fazer upload, teste:

### **Teste 1: Verificar Saldo**

Acesse:
```
https://tkttok.shop/api/evopay/account/balance
```

**Deve retornar:**
```json
{"balance": ..., "eligibleWithdraw": ...}
```

### **Teste 2: Verificar Transações**

Acesse:
```
https://tkttok.shop/api/evopay/account/transactions?limit=10&type=DEPOSIT
```

**Deve retornar:** Lista de transações

---

## 🐛 Problemas Comuns

### ❌ Erro 404

**Causa:** Arquivo não encontrado ou estrutura de pastas incorreta

**Solução:**
1. Verifique se o arquivo existe em `/api/evopay/proxy.php`
2. Verifique se a estrutura de pastas está correta
3. Tente usar `index.php` em vez de `proxy.php`

### ❌ Erro 500

**Causa:** Erro no PHP ou cURL não habilitado

**Solução:**
1. Verifique logs de erro do PHP
2. Verifique se cURL está habilitado: `php -m | grep curl`
3. Verifique se a API Key está correta no arquivo

### ❌ Erro de Permissão

**Causa:** Arquivo sem permissão de leitura

**Solução:**
```bash
chmod 644 /api/evopay/proxy.php
chmod 644 /api/evopay/index.php
```

---

## 📋 Checklist de Deploy

- [ ] Criada pasta `/api/evopay/` no servidor
- [ ] Upload de `proxy.php` OU `index.php`
- [ ] Upload de `.htaccess` (se Apache)
- [ ] Teste de acesso: `https://tkttok.shop/api/evopay/account/balance`
- [ ] Verificação no console: `EvoPay: Modo produção detectado`
- [ ] Teste de geração de PIX funcionando

---

## 🚀 Após o Upload

1. **Acesse:** `https://tkttok.shop`
2. **Abra o Console (F12)**
3. **Procure por:**
   ```
   EvoPay: Modo produção detectado, usando proxy PHP: https://tkttok.shop/api/evopay
   ```
4. **Teste gerar um PIX**
5. **Não deve mais aparecer erro de CORS** ✅

---

## 📝 Notas Importantes

- ✅ O código JavaScript detecta automaticamente produção e usa o proxy
- ✅ Não precisa alterar `index.html` após fazer upload
- ✅ O proxy funciona tanto com `proxy.php` quanto com `index.php`
- ✅ Se usar `.htaccess`, o Apache fará redirect automático

---

**Pronto para fazer upload!** 🚀

