# 🔧 Corrigir: PHP Não Está Sendo Executado

## ❌ Problema

Quando você acessa `https://tkttok.shop/api/evopay/test.php`, o navegador **baixa o arquivo** em vez de executá-lo.

**Causa:** O servidor não está configurado para executar PHP nessa pasta.

---

## ✅ SOLUÇÃO

### **Opção 1: Upload do .htaccess (Recomendado)**

Faça upload do arquivo `.htaccess` para a pasta `/api/evopay/`:

**Localização no seu computador:**
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/.htaccess
```

**Onde fazer upload no servidor:**
```
/api/evopay/.htaccess
```

**O que faz:**
- ✅ Força o servidor a processar arquivos PHP
- ✅ Configura CORS headers
- ✅ Redireciona requisições para proxy.php

---

### **Opção 2: Verificar Configuração do Servidor**

Se o `.htaccess` não funcionar, pode ser que:

1. **Servidor não suporta PHP** na pasta `/api/`
2. **PHP não está habilitado** para essa pasta
3. **Permissões incorretas** nos arquivos

**Verifique:**
- Arquivos têm permissão 644 ou 755?
- Servidor suporta PHP?
- PHP está habilitado?

---

### **Opção 3: Usar index.php**

Se o servidor não processar `proxy.php`, tente usar `index.php`:

1. Renomeie `proxy.php` para `index.php`
2. Faça upload de `index.php` para `/api/evopay/index.php`
3. Teste: `https://tkttok.shop/api/evopay/`

---

## 📋 CHECKLIST

Após fazer upload do `.htaccess`:

- [ ] Arquivo `.htaccess` existe em `/api/evopay/.htaccess`
- [ ] Teste: `https://tkttok.shop/api/evopay/test.php` mostra página (não baixa)
- [ ] Teste: `https://tkttok.shop/api/evopay/account/balance` retorna JSON
- [ ] Site funciona sem erro de CORS

---

## 🔍 VERIFICAÇÃO

### **Teste 1: Verificar se PHP está sendo executado**

Acesse:
```
https://tkttok.shop/api/evopay/test.php
```

**Se mostrar página HTML:** ✅ PHP está funcionando
**Se baixar arquivo:** ❌ PHP não está sendo executado

### **Teste 2: Verificar se proxy funciona**

Acesse:
```
https://tkttok.shop/api/evopay/account/balance
```

**Se retornar JSON:** ✅ Proxy funcionando
**Se baixar arquivo ou der 404:** ❌ Ainda não funciona

---

## 🐛 TROUBLESHOOTING

### ❌ Ainda baixa arquivo

**Possíveis causas:**

1. **Servidor não suporta .htaccess**
   - Verifique se Apache tem `AllowOverride All`
   - Ou configure diretamente no servidor

2. **PHP não está habilitado**
   - Verifique se PHP está instalado
   - Verifique se `.php` está associado ao processador PHP

3. **Pasta incorreta**
   - Verifique se está em `/api/evopay/` e não `/api/evopay/proxy/`

### ✅ Soluções Alternativas

**Se .htaccess não funcionar:**

1. **Configure no servidor diretamente** (via cPanel ou painel)
2. **Use um servidor diferente** que suporte PHP
3. **Configure via Nginx** se usar Nginx em vez de Apache

---

## 📝 RESUMO

**O que fazer:**
1. Fazer upload de `.htaccess` para `/api/evopay/.htaccess`
2. Verificar se `test.php` mostra página (não baixa)
3. Testar se proxy funciona

**Por que:**
- O servidor precisa saber que arquivos `.php` devem ser executados
- O `.htaccess` configura isso automaticamente

---

**🚨 AÇÃO: Fazer upload do `.htaccess` para `/api/evopay/.htaccess`!**

