/**
 * Script para renderizar produtos criados no admin
 */

(function() {
  console.log('🎨 Renderizador de Produtos Admin: Carregado');
  
  const STORAGE_KEY = 'tiktok_shop_products';
  
  // Carregar produtos do admin
  function carregarProdutos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored);
        console.log('🎨 Produtos carregados:', products.length);
        return products;
      }
    } catch (e) {
      console.warn('🎨 Erro ao carregar produtos:', e);
    }
    return [];
  }
  
  // Extrair slug da URL
  function getSlugFromUrl() {
    let slug = window.location.hash;
    if (slug.startsWith('#/')) {
      slug = slug.substring(2);
    } else if (slug.startsWith('#')) {
      slug = slug.substring(1);
    }
    
    // Remove trailing slash
    if (slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }
    
    return slug.toLowerCase();
  }
  
  // Encontrar produto pelo slug
  function encontrarProduto(slug) {
    if (!slug) return null;
    
    const produtos = carregarProdutos();
    return produtos.find(p => p.slug.toLowerCase() === slug);
  }
  
  // Renderizar produto do admin
  function renderizarProduto(produto) {
    console.log('🎨 Renderizando produto:', produto.name);
    
    // Ocultar todo conteúdo existente do React
    const root = document.getElementById('root');
    if (root) {
      // Mantém o root mas oculta todo conteúdo interno
      Array.from(root.children).forEach(child => {
        child.style.display = 'none';
      });
    }
    
    // Criar container para produto do admin
    let container = document.getElementById('admin-product-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'admin-product-container';
      container.style.cssText = `
        position: relative;
        z-index: 9999;
        background: white;
        min-height: 100vh;
      `;
      document.body.appendChild(container);
    }
    
    // Calcular desconto se tiver preço original
    let descontoPercentual = 0;
    if (produto.originalPrice && produto.originalPrice > produto.price) {
      descontoPercentual = Math.round(((produto.originalPrice - produto.price) / produto.originalPrice) * 100);
    } else if (produto.discount) {
      descontoPercentual = produto.discount;
    }
    
    // Template do produto (estilo TikTok Shop)
    const html = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #admin-product-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
        }
        .header {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          background: white;
          z-index: 100;
        }
        .header-back {
          font-size: 24px;
          cursor: pointer;
          margin-right: 16px;
        }
        .header-title {
          font-size: 16px;
          font-weight: 600;
        }
        .header-actions {
          margin-left: auto;
          display: flex;
          gap: 16px;
          font-size: 20px;
        }
        .product-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          background: #f5f5f5;
        }
        .product-info {
          padding: 16px;
        }
        .product-price-container {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 8px;
        }
        .product-price {
          font-size: 28px;
          font-weight: 700;
          color: #fe2c55;
        }
        .product-original-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
        .product-discount {
          background: #fe2c55;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .product-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
          line-height: 1.4;
        }
        .product-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 16px;
          white-space: pre-wrap;
        }
        .product-stock {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .stock-icon {
          font-size: 20px;
        }
        .stock-text {
          font-size: 14px;
          color: #666;
        }
        .stock-number {
          font-weight: 600;
          color: #333;
        }
        .action-buttons {
          padding: 16px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 12px;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          max-width: 600px;
          margin: 0 auto;
        }
        .btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary {
          background: white;
          color: #333;
          border: 1px solid #ddd;
        }
        .btn-primary {
          background: #fe2c55;
          color: white;
        }
        .btn:active {
          transform: scale(0.98);
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid #eee;
          padding: 0 16px;
        }
        .tab {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-size: 14px;
          color: #666;
        }
        .tab.active {
          color: #333;
          font-weight: 600;
          border-bottom-color: #fe2c55;
        }
        .content-spacer {
          height: 80px;
        }
      </style>
      
      <div class="header">
        <div class="header-back" onclick="window.history.back()">←</div>
        <div class="header-title">Detalhes do Produto</div>
        <div class="header-actions">
          <div onclick="navigator.share ? navigator.share({title: '${produto.name}', url: window.location.href}) : alert('Link copiado!')">🔗</div>
          <div>🛒</div>
        </div>
      </div>
      
      <div class="tabs">
        <div class="tab active">Visão geral</div>
        <div class="tab">Avaliações</div>
        <div class="tab">Descrição</div>
        <div class="tab">Recomendações</div>
      </div>
      
      <img src="${produto.image}" alt="${produto.name}" class="product-image" onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">
      
      <div class="product-info">
        <div class="product-price-container">
          <div class="product-price">R$ ${parseFloat(produto.price).toFixed(2).replace('.', ',')}</div>
          ${produto.originalPrice ? `<div class="product-original-price">R$ ${parseFloat(produto.originalPrice).toFixed(2).replace('.', ',')}</div>` : ''}
          ${descontoPercentual > 0 ? `<div class="product-discount">-${descontoPercentual}%</div>` : ''}
        </div>
        
        <div class="product-name">${produto.name}</div>
        
        ${produto.description ? `<div class="product-description">${produto.description}</div>` : ''}
        
        ${produto.stock ? `
        <div class="product-stock">
          <div class="stock-icon">📦</div>
          <div class="stock-text">
            <span class="stock-number">${produto.stock}</span> unidades disponíveis
          </div>
        </div>
        ` : ''}
        
        <div class="content-spacer"></div>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-secondary">Adicionar ao carrinho</button>
        <button class="btn btn-primary">Comprar agora<br><small style="font-size: 11px; font-weight: normal;">Frete Grátis</small></button>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    console.log('✅ Produto renderizado com sucesso!');
  }
  
  // Verificar se deve renderizar produto do admin
  async function verificarERenderizar() {
    // Ignora rotas admin
    if (window.location.pathname.includes('/admin')) {
      return;
    }
    
    const slug = getSlugFromUrl();
    if (!slug) {
      console.log('🎨 Página inicial - não renderiza produto admin');
      return;
    }
    
    const produto = encontrarProduto(slug);
    if (produto) {
      // Aguarda a página carregar
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });
      
      // Pequeno delay para garantir que React já renderizou
      setTimeout(() => {
        renderizarProduto(produto);
      }, 100);
    } else {
      console.log('🎨 Slug não corresponde a produto do admin:', slug);
    }
  }
  
  // Inicializar
  verificarERenderizar();
  
  // Re-verificar quando a URL mudar
  window.addEventListener('hashchange', verificarERenderizar);
  
})();

