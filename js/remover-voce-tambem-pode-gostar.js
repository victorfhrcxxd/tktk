/**
 * Remove APENAS "Você também pode gostar" - ULTRA CONSERVADOR
 * Não toca em NENHUM container principal
 */

(function() {
  console.log('🧹 Remover "Você também pode gostar": Carregado');
  
  function removerSecao() {
    let removidos = 0;
    
    // Busca APENAS por headings (H2, H3) com esse texto
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach(heading => {
      const texto = heading.textContent.toLowerCase().trim();
      
      // Verifica se é EXATAMENTE esse texto (ou variações próximas)
      const isMatch = texto === 'você também pode gostar' ||
                      texto === 'voce tambem pode gostar' ||
                      texto.includes('você também pode gostar') ||
                      texto.includes('voce tambem pode gostar');
      
      if (isMatch) {
        console.log('🧹 Título encontrado:', heading.textContent);
        
        // Procura o container pai mais próximo que seja uma SECTION
        let container = heading.parentElement;
        let tentativas = 0;
        
        while (container && tentativas < 3) {
          if (container.tagName === 'SECTION') {
            // Verifica se a section tem tamanho razoável (não é a página inteira)
            const rect = container.getBoundingClientRect();
            const altura = rect.bottom - rect.top;
            
            // Só remove se for uma seção pequena/média (< 500px de altura)
            // E se não tiver classe que indica ser container principal
            const className = (container.className || '').toLowerCase();
            const isMainContainer = className.includes('min-h-screen') || 
                                   className.includes('h-screen') ||
                                   altura > 500;
            
            if (!isMainContainer) {
              console.log('🧹 ✅ Removendo section:', container.className);
              container.style.display = 'none';
              removidos++;
              return; // Para após remover
            } else {
              console.log('⚠️ Section muito grande ou importante, pulando');
            }
          }
          
          container = container.parentElement;
          tentativas++;
        }
        
        // Se não encontrou SECTION adequada, remove apenas o heading e próximos elementos
        if (removidos === 0) {
          console.log('🧹 Removendo apenas heading e elementos próximos');
          heading.style.display = 'none';
          
          // Remove próximos 2-3 elementos (provavelmente os produtos relacionados)
          let next = heading.nextElementSibling;
          let count = 0;
          while (next && count < 3) {
            const className = (next.className || '').toLowerCase();
            // Só remove se não for container principal
            if (!className.includes('min-h-screen') && 
                !className.includes('h-screen') &&
                next.tagName !== 'FOOTER') {
              next.style.display = 'none';
              count++;
            }
            next = next.nextElementSibling;
          }
          
          removidos++;
        }
      }
    });
    
    if (removidos > 0) {
      console.log(`🧹 ✅ "${removidos}" seções removidas`);
    } else {
      console.log('🧹 Nenhuma seção "Você também pode gostar" encontrada');
    }
  }
  
  // Aguarda React renderizar
  function aguardar() {
    return new Promise((resolve) => {
      const check = () => {
        const root = document.getElementById('root');
        if (root && root.textContent.length > 100) {
          resolve();
          return true;
        }
        return false;
      };
      
      if (check()) return;
      
      setTimeout(() => {
        check();
        resolve();
      }, 3000);
    });
  }
  
  // Inicializa
  async function init() {
    await aguardar();
    console.log('🧹 Tentando remover "Você também pode gostar"...');
    removerSecao();
    
    // Tenta novamente após 2 segundos (caso React demore)
    setTimeout(() => {
      console.log('🧹 Segunda tentativa...');
      removerSecao();
    }, 2000);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Observa mudanças de URL (React Router)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(removerSecao, 500);
    }
  }).observe(document, {subtree: true, childList: true});
})();

