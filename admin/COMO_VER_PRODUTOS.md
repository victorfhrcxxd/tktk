# 📱 Como Visualizar Produtos Criados

## 🎯 Acessando o Produto

### Método 1: Via Slug (URL Amigável)
```
http://localhost:8000/#{SLUG-DO-PRODUTO}
```

**Exemplo:**
- Se o produto se chama "Notebook Dell"
- O slug será: `notebook-dell`
- Acesse: `http://localhost:8000/#/notebook-dell`

### Método 2: Via ID
```
http://localhost:8000/?produto={ID-DO-PRODUTO}
```

---

## 📋 Passo a Passo

### 1. Vá para o Admin
```
http://localhost:8000/admin/
```

### 2. Encontre seu Produto
- Você verá o produto listado
- Ao lado dele há um botão **"Ver Página"** 👁️

### 3. Clique em "Ver Página"
- Será redirecionado automaticamente para a página do produto

---

## 🔍 Como Encontrar o Slug

No painel admin, o **slug** está exibido em cada produto:

```
┌─────────────────────────────┐
│ 📱 iPhone 16 Pro Max       │
│ R$ 8.999,00                │
│ Slug: iphone-16-pro-max    │  ← ESTE É O SLUG
│ [✏️ Editar] [🗑️ Excluir]  │
└─────────────────────────────┘
```

---

## 💡 Dica Rápida

**Para testar rapidamente:**

1. Copie o **slug** do produto
2. Cole nesta URL: `http://localhost:8000/#/SEU-SLUG-AQUI`
3. Pressione Enter

---

## ⚠️ IMPORTANTE

O sistema atual de produtos (`js/produtos-individuais.js`) ainda usa 
uma lista fixa de produtos. Vou atualizar isso AGORA para usar os 
produtos do admin automaticamente!

