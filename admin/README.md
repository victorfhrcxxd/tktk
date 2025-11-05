# 🛍️ Painel Administrativo - TikTok Shop

Sistema completo de gerenciamento de produtos para sua loja.

---

## 🚀 Como Acessar

### Local:
```
http://localhost:8000/admin/
```

### Rede:
```
http://192.168.0.204:8000/admin/
```

---

## ✨ Funcionalidades

### ✅ Gerenciamento de Produtos
- Criar novos produtos
- Editar produtos existentes
- Excluir produtos
- Ativar/Desativar produtos

### ✅ Campos do Produto
- **Nome**: Nome do produto
- **Preço**: Preço atual (R$)
- **Preço Original**: Preço antes do desconto
- **Desconto**: Porcentagem de desconto (%)
- **Imagem Principal**: URL da imagem principal
- **Galeria**: Múltiplas imagens (separadas por vírgula)
- **Descrição Curta**: Resumo do produto
- **Descrição Completa**: Detalhes completos
- **Slug**: URL amigável (ex: `iphone-16`)
- **Status**: Ativo ou Inativo
- **Estoque**: Quantidade disponível

### ✅ Recursos Avançados
- **Exportar Dados**: Backup em JSON
- **Importar Dados**: Restaurar produtos
- **Auto-geração de Slug**: Slug criado automaticamente
- **Estatísticas**: Visão geral dos produtos
- **Preview**: Pré-visualização de imagens

---

## 📝 Como Usar

### 1. Criar Novo Produto

1. Clique em **"➕ Novo Produto"**
2. Preencha os campos:
   - **Nome**: "iPhone 16 Pro Max"
   - **Preço**: 2999.90
   - **Preço Original**: 3999.90 (opcional)
   - **Desconto**: 25 (opcional)
   - **Imagem**: "assets/iphone16-branco-main-Du_xFDn3.jpg"
   - **Galeria**: "assets/iphone16-azul-1-CWAUQpxg.webp, assets/iphone16-preto-1-a1ANrvVc.webp"
   - **Descrição**: Texto breve
   - **Slug**: "iphone-16-pro-max" (gerado automaticamente)
   - **Status**: Ativo
   - **Estoque**: 100
3. Clique em **"💾 Salvar Produto"**

### 2. Editar Produto

1. Encontre o produto na lista
2. Clique em **"✏️ Editar"**
3. Modifique os campos
4. Clique em **"💾 Salvar Produto"**

### 3. Excluir Produto

1. Encontre o produto na lista
2. Clique em **"🗑️ Excluir"**
3. Confirme a exclusão

### 4. Exportar Produtos

1. Clique em **"💾 Exportar Dados"**
2. Arquivo JSON será baixado
3. Guarde como backup!

### 5. Importar Produtos

1. Clique em **"📥 Importar Dados"**
2. Selecione arquivo JSON
3. Produtos serão restaurados

---

## 🎯 Dicas Importantes

### URLs das Imagens

Use caminhos relativos à raiz do site:

✅ **CERTO**:
```
assets/produto-main.jpg
assets/iphone16-branco-main-Du_xFDn3.jpg
```

❌ **ERRADO**:
```
http://localhost:8000/assets/produto-main.jpg
/Users/Downloads/imagem.jpg
C:\Users\imagem.jpg
```

### Slug da URL

O slug define a URL do produto:

- **Slug**: `iphone-16`
- **URL**: `http://localhost:8000/#/iphone-16`

**Regras**:
- Apenas letras minúsculas
- Números permitidos
- Use hífen (-) para espaços
- Sem acentos ou caracteres especiais

### Galeria de Imagens

Separe múltiplas imagens com vírgula:

```
assets/produto-1.jpg, assets/produto-2.jpg, assets/produto-3.jpg
```

---

## 💾 Armazenamento

Os dados são salvos no **localStorage** do navegador:

- ✅ **Vantagem**: Não precisa de backend/servidor
- ✅ **Simples**: Funciona localmente
- ⚠️ **Atenção**: Dados ficam no navegador
- 💡 **Dica**: Faça backup regular (Exportar Dados)

---

## 📊 Integração com o Site

O painel atualiza automaticamente o arquivo de configuração que o site principal lê.

**Como funciona**:
1. Você cria/edita produto no Admin
2. Admin salva em `localStorage`
3. Site principal lê do `localStorage`
4. Produto aparece automaticamente!

---

## 🔒 Segurança (Futuro)

Atualmente o painel é aberto. Para produção, considere:

1. **Autenticação**: Login com usuário/senha
2. **Backend**: API para salvar dados
3. **Banco de Dados**: MySQL, PostgreSQL, MongoDB
4. **Hospedagem**: Servidor seguro

---

## 🐛 Solução de Problemas

### Produtos não aparecem?

1. Verifique se status está **"Ativo"**
2. Recarregue o site principal
3. Limpe cache (Ctrl + Shift + R)

### Imagens não carregam?

1. Verifique caminho da imagem
2. Certifique-se que arquivo existe em `/assets/`
3. Use caminho relativo (sem `http://`)

### Dados sumiram?

1. Dados ficam no localStorage do navegador
2. Se limpar cache, dados são perdidos!
3. **Solução**: Sempre exporte backup regularmente

### Slug duplicado?

Cada produto precisa ter slug único:
- `iphone-16` ✅
- `iphone-16-pro` ✅
- `iphone-16` (de novo) ❌

---

## 📁 Estrutura de Arquivos

```
admin/
├── index.html           # Interface do painel
├── admin.js             # Lógica de gerenciamento
└── README.md            # Este arquivo
```

---

## 🎨 Personalização

### Mudar Cor Principal

Em `index.html`, procure por `#fe2c55` e substitua por sua cor:

```css
background: #fe2c55;  /* Sua cor aqui */
```

### Adicionar Campos

Em `index.html`, adicione novo campo no formulário:

```html
<div class="form-group">
    <label>Novo Campo</label>
    <input type="text" id="product-novo-campo">
</div>
```

Em `admin.js`, adicione ao `productData`:

```javascript
novoСampo: document.getElementById('product-novo-campo').value
```

---

## 🚀 Próximas Melhorias

- [ ] Sistema de login
- [ ] Upload de imagens
- [ ] Editor de texto rico (WYSIWYG)
- [ ] Categorias de produtos
- [ ] Tags
- [ ] SEO por produto
- [ ] Múltiplas variações (cores, tamanhos)
- [ ] Gerenciamento de pedidos
- [ ] Analytics

---

## 📞 Suporte

Se tiver dúvidas:
1. Veja os exemplos acima
2. Verifique console do navegador (F12)
3. Teste em modo de navegação anônima

---

**Painel Admin está pronto para uso!** 🎉

Acesse: `http://localhost:8000/admin/`

