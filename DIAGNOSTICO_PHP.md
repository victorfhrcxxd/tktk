# 🔍 Diagnóstico: PHP Não Está Sendo Executado

## ❌ Sintoma

Quando você acessa `https://tkttok.shop/api/evopay/test.php`, o navegador **baixa o arquivo** em vez de mostrar a página.

---

## 🔍 DIAGNÓSTICO PASSO A PASSO

### **Teste 1: PHP funciona na raiz?**

**Crie um arquivo `test-php.php` na raiz do site:**

```php
<?php
echo "PHP está funcionando!";
phpinfo();
?>
```

**Acesse:** `https://tkttok.shop/test-php.php`

**Resultado:**
- ✅ **Mostra página com informações:** PHP funciona na raiz
- ❌ **Baixa arquivo:** PHP não está configurado no servidor

---

### **Teste 2: PHP funciona em `/api/`?**

**Crie um arquivo `test-php.php` em `/api/`:**

```php
<?php
echo "PHP está funcionando em /api/!";
?>
```

**Acesse:** `https://tkttok.shop/api/test-php.php`

**Resultado:**
- ✅ **Mostra página:** PHP funciona em `/api/`
- ❌ **Baixa arquivo:** PHP não funciona em `/api/`

---

### **Teste 3: Verificar arquivo .htaccess**

**Verifique se o arquivo existe:**
```
https://tkttok.shop/api/evopay/.htaccess
```

**Se baixar:** Arquivo existe mas não está sendo processado
**Se der 404:** Arquivo não existe

---

## ✅ SOLUÇÕES POR CENÁRIO

### **Cenário 1: PHP funciona na raiz, mas não em `/api/`**

**Problema:** Servidor não processa PHP em subpastas

**Solução:**
1. Configure no painel do servidor (cPanel, Plesk, etc.)
2. Ou mova arquivos para raiz: `/api-evopay.php`
3. Ou configure diretamente no servidor via SSH

---

### **Cenário 2: PHP não funciona em lugar nenhum**

**Problema:** PHP não está instalado ou habilitado

**Solução:**
1. Entre em contato com suporte da hospedagem
2. Verifique se o plano suporta PHP
3. Instale/habilite PHP no servidor

---

### **Cenário 3: .htaccess não funciona**

**Problema:** Servidor não suporta `.htaccess` ou está desabilitado

**Solução:**
1. Verifique se Apache tem `AllowOverride All`
2. Configure diretamente no servidor (não via `.htaccess`)
3. Use configuração do servidor (Nginx, etc.)

---

## 🔧 SOLUÇÃO ALTERNATIVA: Usar index.php

O código JavaScript foi atualizado para tentar `index.php` automaticamente.

**Teste:**
```
https://tkttok.shop/api/evopay/account/balance
```

O sistema tentará:
1. `proxy.php` → Se der 404
2. `index.php` → Se proxy não funcionar
3. API direta → Se ambos falharem

---

## 📝 CHECKLIST

- [ ] PHP funciona na raiz? (`test-php.php`)
- [ ] PHP funciona em `/api/`? (`/api/test-php.php`)
- [ ] Arquivo `.htaccess` existe? (`/api/evopay/.htaccess`)
- [ ] Arquivo `index.php` existe? (`/api/evopay/index.php`)
- [ ] Arquivo `proxy.php` existe? (`/api/evopay/proxy.php`)

---

## 🆘 SE NADA FUNCIONAR

**Entre em contato com suporte da hospedagem:**

1. "PHP está habilitado para subpastas?"
2. "Como habilitar PHP para processar arquivos `.php` em `/api/`?"
3. "O servidor suporta `.htaccess`? Como habilitar?"

---

**🚨 AÇÃO: Fazer o Teste 1 primeiro para diagnosticar o problema!**

