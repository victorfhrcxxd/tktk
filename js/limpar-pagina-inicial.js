/**
 * Remove elementos indesejados da página inicial
 * - Remove seção "Você também pode gostar"
 * - Remove fotos dos produtos abaixo
 */

(function() {
  console.log('🧹 Limpeza da página inicial: Carregado');
  
  function removerElementos() {
    let removidos = 0;
    
    // 1. Remove seção "Você também pode gostar"
    const textosParaRemover = [
      'você também pode gostar',
      'voce tambem pode gostar',
      'você também pode',
      'também pode gostar',
      'related products',
      'produtos relacionados',
      'produtos similares',
      'recomendados',
      'sugestões'
    ];
    
    // Busca por texto
    textosParaRemover.forEach(texto => {
      const xpath = `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${texto}')]`;
      const elements = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
        null
      );
      
      let element;
      while (element = elements.iterateNext()) {
        // Encontra o container pai (section, div, etc)
        let container = element;
        for (let i = 0; i < 5; i++) {
          if (container) {
            const parent = container.parentElement;
            if (parent && (
              parent.tagName === 'SECTION' ||
              parent.tagName === 'DIV' ||
              parent.className.includes('section') ||
              parent.className.includes('container') ||
              parent.className.includes('grid')
            )) {
              container = parent;
            } else {
              break;
            }
          }
        }
        
        if (container && container !== element) {
          container.style.display = 'none';
          removidos++;
          console.log('✅ Removido: "Você também pode gostar"');
        }
      }
    });
    
    // 2. Remove produtos abaixo (DESABILITADO - estava causando página em branco)
    // TODO: Implementar de forma mais segura
    /*
    const path = window.location.pathname.toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const isPaginaInicial = (path === '/' || path === '/index.html') && !hash.includes('/');
    
    if (isPaginaInicial) {
      // Encontra TODAS as imagens de produtos
      const imagensProdutos = Array.from(document.querySelectorAll('img[src*="assets/"]'));
      
      if (imagensProdutos.length === 0) {
        console.log('⚠️ Nenhuma imagem de produto encontrada');
        // Não retorna aqui, continua para remover "Você também pode gostar"
      }
      
      // Ordena por posição Y
      imagensProdutos.sort((a, b) => {
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        return (rectA.top + window.scrollY) - (rectB.top + window.scrollY);
      });
      
      // Primeira imagem é a referência (MANTÉM)
      const primeiraImagem = imagensProdutos[0];
      const rectPrimeira = primeiraImagem.getBoundingClientRect();
      const posicaoReferencia = rectPrimeira.top + window.scrollY;
      
      console.log(`📦 Primeira imagem encontrada na posição: ${posicaoReferencia}`);
      console.log(`📦 Total de imagens: ${imagensProdutos.length}`);
      
      // Remove apenas as imagens que estão SIGNIFICATIVAMENTE abaixo da primeira
      let produtosRemovidos = 0;
      
      // Calcula altura da primeira imagem como referência
      const alturaPrimeira = rectPrimeira.bottom - rectPrimeira.top;
      const limite = posicaoReferencia + alturaPrimeira + 500; // 500px de margem
      
      imagensProdutos.forEach((img, index) => {
        // PULA a primeira (index 0) - SEMPRE MANTÉM
        if (index === 0) {
          console.log(`✅ Mantendo primeira imagem (produto principal)`);
          return;
        }
        
        const rect = img.getBoundingClientRect();
        const posicaoAtual = rect.top + window.scrollY;
        
        // Remove apenas se está BEM abaixo (mais de 500px da primeira imagem)
        if (posicaoAtual > limite) {
          // Encontra o container pai
          let container = img;
          let tentativas = 0;
          
          while (tentativas < 5) {
            const parent = container.parentElement;
            if (!parent) break;
            
            const parentClass = (parent.className || '').toLowerCase();
            const parentText = (parent.textContent || '').toLowerCase();
            
            // Verifica se é um card/container de produto
            if (parentClass.includes('card') || 
                parentClass.includes('product') ||
                parentClass.includes('item') ||
                parentText.includes('comprar') ||
                parentText.includes('r$')) {
              container = parent;
              break;
            }
            
            container = parent;
            tentativas++;
          }
          
          // Oculta o container APENAS se não é o primeiro produto
          if (container && container !== img && !container.contains(primeiraImagem)) {
            container.style.display = 'none';
            produtosRemovidos++;
            console.log(`✅ Produto abaixo removido (posição: ${posicaoAtual})`);
          }
        }
      });
      
      if (produtosRemovidos > 0) {
        console.log(`✅ ${produtosRemovidos} produtos abaixo removidos`);
        removidos += produtosRemovidos;
      } else {
        console.log('✅ Nenhum produto abaixo para remover');
      }
      
      // Remove seções inteiras abaixo (MUITO conservador)
      if (imagensProdutos.length > 0) {
        document.querySelectorAll('section, div[class*="section"], div[class*="container"], div[class*="grid"]').forEach(section => {
          // NÃO remove se contém a primeira imagem
          if (section.contains(primeiraImagem)) {
            return;
          }
          
          const rect = section.getBoundingClientRect();
          const posicaoAtual = rect.top + window.scrollY;
          
          // Remove apenas se está MUITO abaixo (mais de 800px da primeira imagem)
          if (posicaoAtual > limite + 300) {
            const texto = section.textContent.toLowerCase();
            const temImagens = section.querySelectorAll('img[src*="assets/"]').length > 0;
            
            // Verifica se tem produtos E não é checkout/carrinho
            if ((texto.includes('comprar') || 
                 texto.includes('r$') || 
                 texto.includes('frete') ||
                 temImagens) && 
                !texto.includes('checkout') &&
                !texto.includes('carrinho') &&
                !texto.includes('finalizar') &&
                !section.contains(primeiraImagem)) {
              section.style.display = 'none';
              removidos++;
              console.log('✅ Seção de produtos abaixo removida');
            }
          }
        });
      }
    }
    */
    
    if (removidos > 0) {
      console.log(`🧹 Total: ${removidos} elementos removidos`);
    } else {
      console.log('🧹 Nenhum elemento encontrado para remover');
    }
  }
  
  // Aguarda conteúdo carregar
  function aguardarConteudo() {
    return new Promise((resolve) => {
      if (document.body && document.body.children.length > 0) {
        resolve();
      } else {
        const observer = new MutationObserver(() => {
          if (document.body && document.body.children.length > 0) {
            observer.disconnect();
            resolve();
          }
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        setTimeout(resolve, 2000);
      }
    });
  }
  
  // Inicializa
  async function inicializar() {
    await aguardarConteudo();
    
    // Aguarda mais tempo para React renderizar completamente
    console.log('⏳ Aguardando React renderizar...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Executa após React renderizar
    console.log('🧹 Iniciando limpeza...');
    removerElementos();
    
    // Reexecuta após mais 2 segundos (para garantir)
    setTimeout(() => {
      console.log('🧹 Reexecutando limpeza...');
      removerElementos();
    }, 2000);
  }
  
  // Executa após carregamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
  
  // Reexecuta em mudanças (React Router)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(removerElementos, 500);
    }
  }).observe(document, {subtree: true, childList: true});
})();

