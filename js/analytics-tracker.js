/**
 * Sistema de Analytics e Tracking
 * Rastreia eventos importantes para o painel admin
 */

(function() {
  console.log('📊 Analytics Tracker: Carregado');
  
  const ANALYTICS_KEY = 'tiktok_shop_analytics';
  const EVENTS_KEY = 'tiktok_shop_events';
  
  // Carregar analytics do localStorage
  function loadAnalytics() {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : {
        checkoutViews: 0,
        pixGenerated: 0,
        productViews: {},
        conversionRate: 0,
        lastReset: new Date().toISOString()
      };
    } catch (e) {
      console.warn('📊 Erro ao carregar analytics:', e);
      return {
        checkoutViews: 0,
        pixGenerated: 0,
        productViews: {},
        conversionRate: 0,
        lastReset: new Date().toISOString()
      };
    }
  }
  
  // Salvar analytics
  function saveAnalytics(data) {
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('📊 Erro ao salvar analytics:', e);
    }
  }
  
  // Carregar eventos históricos
  function loadEvents() {
    try {
      const stored = localStorage.getItem(EVENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('📊 Erro ao carregar eventos:', e);
      return [];
    }
  }
  
  // Salvar evento histórico
  function saveEvent(event) {
    try {
      const events = loadEvents();
      events.push({
        ...event,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random()
      });
      
      // Manter apenas últimos 1000 eventos
      if (events.length > 1000) {
        events.shift();
      }
      
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('📊 Erro ao salvar evento:', e);
    }
  }
  
  // Rastrear acesso ao checkout
  function trackCheckoutView(productName, productPrice) {
    console.log('📊 Analytics: Checkout visualizado');
    
    const analytics = loadAnalytics();
    analytics.checkoutViews++;
    
    // Atualizar visualizações por produto
    if (productName) {
      if (!analytics.productViews[productName]) {
        analytics.productViews[productName] = {
          views: 0,
          conversions: 0
        };
      }
      analytics.productViews[productName].views++;
    }
    
    // Calcular taxa de conversão
    if (analytics.checkoutViews > 0) {
      analytics.conversionRate = ((analytics.pixGenerated / analytics.checkoutViews) * 100).toFixed(2);
    }
    
    saveAnalytics(analytics);
    
    // Salvar evento histórico
    saveEvent({
      type: 'checkout_view',
      productName: productName || 'Produto não identificado',
      productPrice: productPrice || 0,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
  
  // Rastrear geração de PIX
  function trackPixGenerated(productName, amount, pixId) {
    console.log('📊 Analytics: PIX gerado');
    
    const analytics = loadAnalytics();
    analytics.pixGenerated++;
    
    // Atualizar conversões por produto
    if (productName && analytics.productViews[productName]) {
      analytics.productViews[productName].conversions++;
    }
    
    // Calcular taxa de conversão
    if (analytics.checkoutViews > 0) {
      analytics.conversionRate = ((analytics.pixGenerated / analytics.checkoutViews) * 100).toFixed(2);
    }
    
    saveAnalytics(analytics);
    
    // Salvar evento histórico
    saveEvent({
      type: 'pix_generated',
      productName: productName || 'Produto não identificado',
      amount: amount || 0,
      pixId: pixId || 'N/A',
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
  
  // Rastrear visualização de produto
  function trackProductView(productName) {
    console.log('📊 Analytics: Produto visualizado -', productName);
    
    saveEvent({
      type: 'product_view',
      productName: productName,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
  
  // Detectar acesso ao checkout automaticamente
  function detectCheckoutView() {
    // Detecta quando formulário de checkout é exibido
    const observer = new MutationObserver(() => {
      // Procura por formulários de checkout
      const checkoutForms = document.querySelectorAll('[class*="payment"], [class*="checkout"], form[class*="form"]');
      
      checkoutForms.forEach(form => {
        if (form.dataset.analyticsTracked) return;
        
        // Marca como rastreado
        form.dataset.analyticsTracked = 'true';
        
        // Tenta identificar produto
        let productName = 'Produto não identificado';
        let productPrice = 0;
        
        // Busca nome do produto na página
        const productTitle = document.querySelector('h1, h2, [class*="product-name"], [class*="title"]');
        if (productTitle) {
          productName = productTitle.textContent.trim();
        }
        
        // Busca preço do produto
        const priceElement = document.querySelector('[class*="price"]');
        if (priceElement) {
          const priceText = priceElement.textContent;
          const priceMatch = priceText.match(/[\d.,]+/);
          if (priceMatch) {
            productPrice = parseFloat(priceMatch[0].replace(',', '.'));
          }
        }
        
        trackCheckoutView(productName, productPrice);
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Interceptar geração de PIX
  function interceptPixGeneration() {
    // Intercepta chamadas fetch para detectar geração de PIX
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
      const url = args[0];
      
      return originalFetch.apply(this, args).then(response => {
        // Detecta criação de PIX
        if (url.includes('/pix') && args[1]?.method === 'POST') {
          response.clone().json().then(data => {
            if (data.id && data.qrCodeBase64) {
              // PIX gerado com sucesso
              const body = args[1]?.body;
              let productName = 'Produto não identificado';
              let amount = 0;
              
              try {
                const bodyData = JSON.parse(body);
                amount = bodyData.amount || 0;
              } catch (e) {}
              
              // Busca nome do produto na página
              const productTitle = document.querySelector('h1, h2, [class*="product-name"], [class*="title"]');
              if (productTitle) {
                productName = productTitle.textContent.trim();
              }
              
              trackPixGenerated(productName, amount, data.id);
            }
          }).catch(() => {});
        }
        
        return response;
      });
    };
  }
  
  // API pública
  window.TikTokAnalytics = {
    trackCheckoutView,
    trackPixGenerated,
    trackProductView,
    loadAnalytics,
    loadEvents,
    reset: function() {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify({
        checkoutViews: 0,
        pixGenerated: 0,
        productViews: {},
        conversionRate: 0,
        lastReset: new Date().toISOString()
      }));
      localStorage.setItem(EVENTS_KEY, JSON.stringify([]));
      console.log('📊 Analytics resetado!');
    }
  };
  
  // Inicializar
  if (!window.location.pathname.includes('/admin')) {
    detectCheckoutView();
    interceptPixGeneration();
    console.log('📊 Analytics ativo e monitorando!');
  }
  
})();

