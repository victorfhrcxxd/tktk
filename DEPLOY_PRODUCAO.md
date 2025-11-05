# 🚀 Guia Rápido: Deploy em Produção

## ⚡ Solução Rápida (3 passos)

### 1️⃣ Teste se funciona direto

Faça upload do site e teste. O sistema detecta automaticamente produção.

**Se funcionar:** ✅ Pronto! Não precisa fazer mais nada.

**Se der erro de CORS:** Continue para o passo 2.

---

### 2️⃣ Crie o Proxy (se necessário)

#### Opção A: Hospedagem Compartilhada (PHP)

1. Crie a pasta: `api/evopay/` no seu servidor
2. Faça upload do arquivo `proxy-evopay.php` para: `api/evopay/proxy.php`
3. Configure no `index.html`:
   ```html
   <meta name="evopay-api-url" content="https://seudominio.com/api/evopay">
   ```

#### Opção B: VPS/Servidor (Node.js)

1. Use o arquivo `proxy-evopay-producao.js`
2. Instale: `npm install express node-fetch cors`
3. Inicie: `node proxy-evopay-producao.js`
4. Configure no `index.html`:
   ```html
   <meta name="evopay-api-url" content="https://seudominio.com/api/evopay">
   ```

---

### 3️⃣ Teste

1. Acesse seu site
2. Abra o console (F12)
3. Procure por: `EvoPay: Modo produção detectado`
4. Tente gerar um PIX
5. ✅ Se o QR Code aparecer = **Funcionando!**

---

## 📋 Checklist de Deploy

- [ ] Site faz upload para hospedagem
- [ ] Testa sem proxy primeiro
- [ ] Se der CORS, cria proxy
- [ ] Configura URL no index.html
- [ ] Testa gerar PIX
- [ ] QR Code aparece corretamente

---

## 🆘 Problemas Comuns

### Erro: "CORS policy"

**Solução:** Crie o proxy PHP ou Node.js (passo 2)

### Erro: "Failed to fetch"

**Solução:** Verifique se a URL está correta e se o proxy está acessível

### QR Code não aparece

**Solução:** Verifique o console para erros específicos

---

## 📞 Suporte

Se ainda não funcionar, verifique:
1. Console do navegador (F12)
2. Logs do servidor (se tiver acesso)
3. URL da API configurada corretamente

---

**Boa sorte com o deploy!** 🚀

