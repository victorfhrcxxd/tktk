/**
 * Remove elementos indesejados da página inicial - VERSÃO 2
 * Mais robusta e específica para React
 * 
 * - Remove seção "Você também pode gostar"
 * - Usa seletores mais específicos
 * - Aguarda React renderizar completamente
 */

(function() {
  console.log('🧹 Limpeza da página inicial V2: Carregado');
  
  // Configuração
  const CONFIG = {
    debug: true,
    aguardarReact: 3000, // ms para aguardar React renderizar
    tentativas: 3, // Quantas vezes tentar limpar
    intervaloTentativas: 1000 // ms entre tentativas
  };
  
  function log(...args) {
    if (CONFIG.debug) {
      console.log('🧹', ...args);
    }
  }
  
  /**
   * Remove "Você também pode gostar" de forma mais específica
   */
  function removerVoceTambemPodeGostar() {
    let removidos = 0;
    
    // Textos para buscar
    const textosParaBuscar = [
      'você também pode gostar',
      'voce tambem pode gostar',
      'recommended',
      'recomendados',
      'similar products',
      'produtos similares'
    ];
    
    // Busca em todos os elementos de texto
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      // Ignora scripts e styles
      if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return;
      }
      
      const texto = element.textContent.toLowerCase().trim();
      
      // Verifica se o elemento contém algum dos textos
      const contemTexto = textosParaBuscar.some(t => texto.includes(t));
      
      if (contemTexto) {
        // Verifica se é um elemento de título ou container
        const isHeading = /^H[1-6]$/.test(element.tagName);
        const isContainer = ['DIV', 'SECTION', 'ARTICLE', 'ASIDE'].includes(element.tagName);
        
        if (isHeading) {
          // Se é título, remove o container pai
          let container = element.parentElement;
          let tentativas = 0;
          
          while (container && tentativas < 5) {
            const tag = container.tagName;
            const className = container.className || '';
            
            // Encontrou um container adequado
            if (tag === 'SECTION' || 
                className.includes('section') || 
                className.includes('container') ||
                className.includes('wrapper')) {
              log('Removendo container:', tag, className);
              container.style.display = 'none';
              removidos++;
              break;
            }
            
            container = container.parentElement;
            tentativas++;
          }
        } else if (isContainer) {
          // Se já é um container, remove diretamente
          log('Removendo container direto:', element.tagName, element.className);
          element.style.display = 'none';
          removidos++;
        }
      }
    });
    
    return removidos;
  }
  
  /**
   * Remove produtos extras de forma mais segura
   * Apenas na página inicial
   */
  function removerProdutosExtras() {
    const path = window.location.pathname.toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    
    // Verifica se está na página inicial
    const isPaginaInicial = (path === '/' || path === '/index.html' || path === '') && 
                           (!hash || hash === '#' || hash === '#/');
    
    if (!isPaginaInicial) {
      log('Não está na página inicial, pulando remoção de produtos');
      return 0;
    }
    
    log('Página inicial detectada');
    
    // TODO: Implementar remoção de produtos de forma mais segura
    // Por enquanto, desabilitado para evitar página em branco
    
    return 0;
  }
  
  /**
   * Aguarda React renderizar
   */
  function aguardarReact() {
    return new Promise((resolve) => {
      // Verifica se #root tem conteúdo
      const checkContent = () => {
        const root = document.getElementById('root');
        if (root && root.children.length > 0) {
          const hasContent = root.textContent.trim().length > 100;
          if (hasContent) {
            log('React renderizado, conteúdo detectado');
            resolve(true);
            return true;
          }
        }
        return false;
      };
      
      // Verifica imediatamente
      if (checkContent()) return;
      
      // Observa mudanças no DOM
      const observer = new MutationObserver(() => {
        if (checkContent()) {
          observer.disconnect();
        }
      });
      
      const root = document.getElementById('root');
      if (root) {
        observer.observe(root, {
          childList: true,
          subtree: true
        });
      }
      
      // Timeout de segurança
      setTimeout(() => {
        observer.disconnect();
        log('Timeout atingido, assumindo que React renderizou');
        resolve(false);
      }, CONFIG.aguardarReact);
    });
  }
  
  /**
   * Executa limpeza completa
   */
  async function executarLimpeza() {
    log('Iniciando limpeza...');
    
    // Aguarda React renderizar
    await aguardarReact();
    
    // Aguarda um pouco mais para garantir
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let totalRemovidos = 0;
    
    // Remove "Você também pode gostar"
    const removidosTexto = removerVoceTambemPodeGostar();
    totalRemovidos += removidosTexto;
    
    if (removidosTexto > 0) {
      log(`✅ ${removidosTexto} elementos "Você também pode gostar" removidos`);
    } else {
      log('Nenhum "Você também pode gostar" encontrado');
    }
    
    // Remove produtos extras (desabilitado)
    const removidosProdutos = removerProdutosExtras();
    totalRemovidos += removidosProdutos;
    
    if (removidosProdutos > 0) {
      log(`✅ ${removidosProdutos} produtos extras removidos`);
    }
    
    if (totalRemovidos === 0) {
      log('Nenhum elemento encontrado para remover');
    }
    
    return totalRemovidos;
  }
  
  /**
   * Executa limpeza com múltiplas tentativas
   */
  async function executarComTentativas() {
    let tentativa = 1;
    
    while (tentativa <= CONFIG.tentativas) {
      log(`Tentativa ${tentativa}/${CONFIG.tentativas}`);
      
      const removidos = await executarLimpeza();
      
      if (removidos > 0) {
        log(`✅ Limpeza concluída com sucesso (${removidos} elementos)`);
        break;
      }
      
      if (tentativa < CONFIG.tentativas) {
        log(`Aguardando ${CONFIG.intervaloTentativas}ms para próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.intervaloTentativas));
      }
      
      tentativa++;
    }
    
    log('Limpeza finalizada');
  }
  
  /**
   * Inicializa o script
   */
  function inicializar() {
    log('Inicializando...');
    
    // Aguarda documento carregar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', executarComTentativas);
    } else {
      executarComTentativas();
    }
    
    // Reexecuta em mudanças de URL (React Router)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        log('URL mudou, executando limpeza novamente');
        setTimeout(executarComTentativas, 500);
      }
    }).observe(document, {
      subtree: true,
      childList: true
    });
  }
  
  // Inicia
  inicializar();
})();

