/**
 * Script para mostrar produtos individualmente
 * Oculta produtos que não correspondem à página atual
 */

(function() {
  console.log('📦 Produtos Individuais: Carregado');
  
  // Carregar produtos do admin (localStorage)
  function carregarProdutosAdmin() {
    try {
      const stored = localStorage.getItem('tiktok_shop_products');
      if (stored) {
        const products = JSON.parse(stored);
        console.log('📦 Produtos do Admin carregados:', products.length);
        return products;
      }
    } catch (e) {
      console.warn('📦 Erro ao carregar produtos do admin:', e);
    }
    return [];
  }
  
  // Configuração de produtos e suas páginas (produtos fixos existentes)
  const produtosConfig = {
    'iphone': {
      keywords: ['iphone', 'iphone16', 'iphone-16'],
      nome: 'iPhone 16'
    },
    'patinete': {
      keywords: ['patinete', 'eletrico'],
      nome: 'Patinete Elétrico'
    },
    'minimoto': {
      keywords: ['minimoto', 'mini-moto', 'moto'],
      nome: 'Mini Moto'
    },
    'tv': {
      keywords: ['tv', 'televisao', 'aoc'],
      nome: 'TV AOC'
    },
    'lavadora': {
      keywords: ['lavadora', 'lava-roupa'],
      nome: 'Lavadora'
    },
    'geladeira': {
      keywords: ['geladeira', 'refrigerador'],
      nome: 'Geladeira'
    },
    'liquidificador': {
      keywords: ['liquidificador'],
      nome: 'Liquidificador'
    },
    'airfryer': {
      keywords: ['airfryer', 'air-fryer', 'fritadeira'],
      nome: 'Air Fryer'
    },
    'cafeteira': {
      keywords: ['cafeteira', 'cafe'],
      nome: 'Cafeteira'
    },
    'panela': {
      keywords: ['panela'],
      nome: 'Panela'
    },
    'cadeira': {
      keywords: ['cadeira', 'gamer'],
      nome: 'Cadeira Gamer'
    }
  };
  
  // Detecta qual produto mostrar baseado na URL
  function detectarProduto() {
    // Pega path, hash e search
    const path = window.location.pathname.toLowerCase();
    let hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    
    // Ignora rotas administrativas
    if (path.includes('/admin')) {
      console.log('📦 Rota administrativa detectada - pulando');
      return null;
    }
    
    // Remove # do hash
    if (hash.startsWith('#')) {
      hash = hash.substring(1);
    }
    
    // Remove / do hash
    if (hash.startsWith('/')) {
      hash = hash.substring(1);
    }
    
    // Combina tudo
    const urlCompleta = (path + hash + search).toLowerCase();
    
    console.log('🔍 Verificando URL:', urlCompleta);
    
    // Primeiro tenta match com produtos do admin (slugs)
    const produtosAdmin = carregarProdutosAdmin();
    for (const produto of produtosAdmin) {
      const slug = produto.slug.toLowerCase();
      if (urlCompleta.includes(slug)) {
        console.log('✅ Match com produto do admin:', produto.name, '(slug:', slug + ')');
        return slug;
      }
    }
    
    // Depois tenta match direto por ID (produtos fixos)
    for (const [id] of Object.entries(produtosConfig)) {
      if (urlCompleta.includes('/' + id) || urlCompleta.includes(id + '/') || urlCompleta === id) {
        console.log('✅ Match direto com produto fixo:', id);
        return id;
      }
    }
    
    // Por último tenta match por keywords (produtos fixos)
    for (const [id, config] of Object.entries(produtosConfig)) {
      for (const keyword of config.keywords) {
        if (urlCompleta.includes(keyword)) {
          console.log('✅ Match por keyword (produto fixo):', id, keyword);
          return id;
        }
      }
    }
    
    console.log('📦 Nenhum produto detectado - mostrando todos');
    return null;
  }
  
  // Aguarda o carregamento do conteúdo
  function aguardarConteudo() {
    return new Promise((resolve) => {
      if (document.querySelector('[data-testid], .product, .produto')) {
        resolve();
      } else {
        const observer = new MutationObserver(() => {
          if (document.querySelector('[data-testid], .product, .produto')) {
            observer.disconnect();
            resolve();
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Timeout de segurança
        setTimeout(resolve, 3000);
      }
    });
  }
  
  // Oculta produtos não selecionados
  function ocultarOutrosProdutos(produtoAtual) {
    if (!produtoAtual) {
      console.log('📦 Página inicial - mostrando todos os produtos');
      return;
    }
    
    console.log(`📦 Mostrando apenas: ${produtosConfig[produtoAtual].nome}`);
    
    // Busca todos os cards/containers de produtos
    const possiveisSelectors = [
      '[class*="product"]',
      '[class*="card"]',
      '[class*="item"]',
      '[data-testid]',
      'a[href*="/"]',
      'div[class*="grid"] > div',
      'section > div > div'
    ];
    
    let produtosEncontrados = 0;
    
    possiveisSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const texto = element.textContent.toLowerCase();
        const html = element.innerHTML.toLowerCase();
        const conteudo = texto + html;
        
        // Verifica se é um card de produto
        const ehProduto = conteudo.includes('comprar') || 
                         conteudo.includes('r$') || 
                         conteudo.includes('frete') ||
                         element.querySelector('img');
        
        if (!ehProduto) return;
        
        // Verifica se é o produto atual
        const config = produtosConfig[produtoAtual];
        const ehProdutoAtual = config.keywords.some(kw => conteudo.includes(kw));
        
        if (!ehProdutoAtual) {
          // Oculta produtos que não correspondem
          const outrosProdutos = Object.entries(produtosConfig)
            .filter(([id]) => id !== produtoAtual);
          
          const ehOutroProduto = outrosProdutos.some(([id, cfg]) => 
            cfg.keywords.some(kw => conteudo.includes(kw))
          );
          
          if (ehOutroProduto) {
            element.style.display = 'none';
            produtosEncontrados++;
          }
        }
      });
    });
    
    if (produtosEncontrados > 0) {
      console.log(`✅ ${produtosEncontrados} produtos ocultados`);
      console.log(`📦 Exibindo apenas: ${produtosConfig[produtoAtual].nome}`);
    }
  }
  
  // Menu removido - produtos são exibidos baseados apenas na URL
  
  // Inicializa
  async function inicializar() {
    console.log('📦 Inicializando produtos individuais...');
    
    // Aguarda conteúdo carregar
    await aguardarConteudo();
    
    // Detecta produto
    const produtoAtual = detectarProduto();
    
    if (produtoAtual) {
      console.log(`📦 Produto detectado: ${produtosConfig[produtoAtual].nome}`);
    } else {
      console.log('📦 Página inicial - todos os produtos');
    }
    
    // Oculta outros produtos
    ocultarOutrosProdutos(produtoAtual);
    
    console.log('✅ Produtos individuais configurado!');
  }
  
  // Executa após carregamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
  
  // Reexecuta em mudanças de URL (React Router)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(inicializar, 500);
    }
  }).observe(document, {subtree: true, childList: true});
})();

