# 🔧 Solução: PHP Baixa Arquivo em vez de Executar

## ❌ Problema

Quando você acessa `https://tkttok.shop/api/evopay/test.php`, o navegador **baixa o arquivo** em vez de mostrar a página.

**Causa:** O servidor não está processando PHP nessa pasta.

---

## ✅ SOLUÇÃO: Upload do .htaccess

### **Arquivo Necessário:**

**Localização no seu computador:**
```
/Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop/api/evopay/.htaccess
```

**Onde fazer upload no servidor:**
```
/api/evopay/.htaccess
```

**IMPORTANTE:** Este arquivo força o servidor a processar PHP!

---

## 📤 COMO FAZER UPLOAD

### **Via FTP/FileZilla:**

1. Conecte-se ao servidor
2. Navegue até `/api/evopay/`
3. Faça upload de `.htaccess`
4. **Certifique-se de que o arquivo está visível** (pode estar oculto)

### **Via cPanel File Manager:**

1. Abra File Manager
2. Vá até `/api/evopay/`
3. Clique em "Upload"
4. Faça upload de `.htaccess`
5. Se não aparecer, ative "Show Hidden Files"

### **Via SSH:**

```bash
# Conecte-se ao servidor
ssh usuario@tkttok.shop

# Navegue até a pasta
cd /caminho/do/site/api/evopay/

# Copie o arquivo
# (ajuste o caminho)
scp /caminho/local/.htaccess usuario@tkttok.shop:/caminho/do/site/api/evopay/
```

---

## ✅ VERIFICAÇÃO

Após fazer upload do `.htaccess`:

### **Teste 1: Verificar se PHP está sendo executado**

Acesse:
```
https://tkttok.shop/api/evopay/test.php
```

**✅ Se mostrar página HTML:** PHP está funcionando!
**❌ Se ainda baixar arquivo:** Verifique se `.htaccess` foi feito upload corretamente

### **Teste 2: Verificar se proxy funciona**

Acesse:
```
https://tkttok.shop/api/evopay/account/balance
```

**✅ Se retornar JSON:** Proxy funcionando!
**❌ Se ainda dar erro:** Verifique configuração do servidor

---

## 🐛 SE AINDA NÃO FUNCIONAR

### **Opção 1: Verificar se arquivo está no lugar certo**

Certifique-se de que:
- ✅ Arquivo está em `/api/evopay/.htaccess` (não `/api/.htaccess`)
- ✅ Arquivo tem permissão 644 ou 755
- ✅ Arquivo não está vazio

### **Opção 2: Verificar configuração do servidor**

Se `.htaccess` não funcionar, pode ser que:

1. **Servidor não suporta .htaccess**
   - Verifique se Apache tem `AllowOverride All`
   - Configure diretamente no servidor

2. **PHP não está habilitado**
   - Verifique se PHP está instalado
   - Verifique se módulo PHP está ativo

3. **Pasta não permite PHP**
   - Verifique configurações do servidor
   - Entre em contato com suporte da hospedagem

### **Opção 3: Usar index.php**

Se nada funcionar:

1. Renomeie `proxy.php` para `index.php`
2. Faça upload para `/api/evopay/index.php`
3. Acesse: `https://tkttok.shop/api/evopay/` (sem `proxy.php`)

---

## 📋 CHECKLIST FINAL

- [ ] Arquivo `.htaccess` existe em `/api/evopay/.htaccess`
- [ ] Arquivo `proxy.php` existe em `/api/evopay/proxy.php`
- [ ] Teste: `https://tkttok.shop/api/evopay/test.php` mostra página
- [ ] Teste: `https://tkttok.shop/api/evopay/account/balance` retorna JSON
- [ ] Site funciona sem erro de CORS

---

## 📝 RESUMO

**O que fazer:**
1. Fazer upload de `.htaccess` para `/api/evopay/.htaccess`
2. Verificar se `test.php` mostra página (não baixa)
3. Testar se proxy funciona

**Por que:**
- O `.htaccess` força o servidor a processar arquivos PHP
- Sem ele, o servidor serve PHP como texto puro

---

**🚨 AÇÃO: Fazer upload do `.htaccess` para `/api/evopay/.htaccess`!**

Este arquivo é essencial para que o PHP seja executado corretamente.

