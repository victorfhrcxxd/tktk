# ⚡ Início Rápido - Painel Admin

## 🚀 Acesse Agora

```
http://localhost:8000/admin/
```

---

## 🎯 Criar Seu Primeiro Produto (2 minutos)

### Passo 1: Acesse o Painel
Abra: `http://localhost:8000/admin/`

### Passo 2: Clique em "➕ Novo Produto"

### Passo 3: Preencha os Dados

**Exemplo - iPhone 16**:
```
Nome: iPhone 16 Pro Max
Preço: 2999.90
Preço Original: 3999.90
Desconto: 25
Imagem: assets/iphone16-branco-main-Du_xFDn3.jpg
Descrição: iPhone 16 com tecnologia A18 Pro
Slug: iphone-16 (gerado automaticamente)
Status: Ativo
Estoque: 50
```

### Passo 4: Clique em "💾 Salvar Produto"

### Passo 5: Pronto! ✅

Seu produto foi criado e já está disponível em:
```
http://localhost:8000/#/iphone-16
```

---

## 📋 Ações Rápidas

| Ação | Como Fazer |
|------|------------|
| **Criar produto** | Botão "➕ Novo Produto" |
| **Editar produto** | Botão "✏️ Editar" no card do produto |
| **Excluir produto** | Botão "🗑️ Excluir" no card do produto |
| **Fazer backup** | Botão "💾 Exportar Dados" |
| **Restaurar backup** | Botão "📥 Importar Dados" |

---

## 💡 Dicas Importantes

### 1. URLs das Imagens

Use caminhos relativos:
```
✅ CERTO: assets/produto-main.jpg
❌ ERRADO: http://localhost:8000/assets/produto-main.jpg
```

### 2. Slug da URL

- Define a URL do produto
- Gerado automaticamente ao digitar o nome
- Use apenas: letras minúsculas, números, hífen (-)
- Exemplo: `iphone-16`, `patinete-eletrico`

### 3. Galeria de Imagens

Múltiplas imagens separadas por vírgula:
```
assets/produto-1.jpg, assets/produto-2.jpg, assets/produto-3.jpg
```

### 4. Faça Backup Regular

Clique em "💾 Exportar Dados" semanalmente!

---

## 🎨 Campos do Formulário

| Campo | Obrigatório | Exemplo |
|-------|-------------|---------|
| Nome | ✅ Sim | iPhone 16 Pro Max |
| Preço | ✅ Sim | 2999.90 |
| Preço Original | ❌ Não | 3999.90 |
| Desconto | ❌ Não | 25 |
| Imagem | ✅ Sim | assets/iphone.jpg |
| Galeria | ❌ Não | assets/img1.jpg, assets/img2.jpg |
| Descrição | ❌ Não | Texto breve |
| Descrição Completa | ❌ Não | Texto detalhado |
| Slug | ✅ Sim | iphone-16 (auto) |
| Status | ✅ Sim | Ativo |
| Estoque | ❌ Não | 100 |

---

## 🔄 Fluxo de Trabalho

```
1. Criar Produto no Admin
   ↓
2. Preencher Dados
   ↓
3. Salvar
   ↓
4. Produto Aparece Automaticamente no Site!
   ↓
5. Acessar: http://localhost:8000/#/[slug]
```

---

## 📊 Estatísticas

No topo do painel você vê:
- **Total de Produtos**: Todos os produtos cadastrados
- **Produtos Ativos**: Apenas os que estão visíveis no site
- **Páginas Criadas**: Uma página por produto

---

## 🆘 Problemas Comuns

### Produto não aparece no site?

1. Status está "Ativo"? ✅
2. Recarregou o site? (Ctrl + Shift + R)
3. Slug está correto?

### Imagem não carrega?

1. Arquivo existe em `/assets/`?
2. Caminho está correto?
3. Nome do arquivo está certo?

### Dados sumiram?

- Dados ficam no navegador (localStorage)
- Se limpar cache, perde dados!
- **Solução**: Sempre faça backup!

---

## 🎯 Próximos Passos

Depois de criar produtos:

1. **Teste no site**: `http://localhost:8000/#/[slug]`
2. **Edite conforme necessário**
3. **Faça backup** (Exportar Dados)
4. **Adicione mais produtos!**

---

## 📖 Documentação Completa

Para mais detalhes, leia:
```
README.md
```

---

**Tempo para criar primeiro produto**: 2 minutos ⏱️

**Acesse agora**: `http://localhost:8000/admin/` 🚀

