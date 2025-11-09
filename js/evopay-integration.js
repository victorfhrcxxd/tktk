/**
 * EvoPay PIX Integration
 * Integração customizada com a API EvoPay para pagamentos PIX
 */

/**
 * Função auxiliar para gerar QR Code a partir do código PIX usando API externa
 * Usa um serviço público de geração de QR Code como fallback
 */
async function generateQrCodeFromPixCode(pixCode) {
  if (!pixCode) return null;
  
  try {
    // Usa API pública para gerar QR Code a partir do código PIX
    // Alternativa: usar biblioteca client-side como qrcode.js
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
    
    // Converte a URL da imagem em base64
    const response = await fetch(qrCodeApiUrl);
    if (response.ok) {
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Retorna como data:image/png;base64,...
        };
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.warn('EvoPay: Erro ao gerar QR Code a partir do código PIX:', error);
  }
  
  return null;
}

class EvoPay {
  constructor(apiKey, apiUrl = 'https://api.evopay.cash') {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.initialized = false;
    this.directApiUrl = 'https://pix.evopay.cash/v1';
  }

  /**
   * Helper: Tenta proxy primeiro, se der 404 tenta API direta
   * Em produção/mobile, sempre usa o proxy PHP (/api/evopay)
   */
  async fetchWithFallback(url, options = {}) {
    // Garante que a URL está correta para produção/mobile/tkttok.shop
    const currentHost = window.location.hostname;
    const protocol = window.location.protocol;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLocalhost = currentHost === 'localhost' || 
                        currentHost === '127.0.0.1' || 
                        currentHost.match(/^192\.168\./);
    const isProduction = !isLocalhost || currentHost.includes('tkttok.shop');
    
    // Se está em produção/mobile/tkttok.shop e a URL ainda aponta para localhost, corrige
    if ((isProduction || isMobile || currentHost.includes('tkttok.shop')) && 
        this.apiUrl && (this.apiUrl.includes('localhost') || this.apiUrl.includes('127.0.0.1') || this.apiUrl.includes(':8001'))) {
      this.apiUrl = `${protocol}//${currentHost}/api/evopay`;
      console.log('EvoPay: URL corrigida no fetchWithFallback para:', this.apiUrl);
    }
    
    let fullUrl = `${this.apiUrl}${url}`;
    
    try {
      let response = await fetch(fullUrl, options);
      
      // Se proxy retorna 404, tenta index.php primeiro
      if (!response.ok && response.status === 404 && this.apiUrl.includes('/api/evopay')) {
        console.warn(`EvoPay: Proxy não encontrado (404) para ${url}, tentando index.php...`);
        
        // Tenta index.php em vez de proxy.php (corrige bug da barra faltando)
        let indexUrl = fullUrl;
        if (indexUrl.includes('/api/evopay/')) {
          indexUrl = indexUrl.replace('/api/evopay/', '/api/evopay/index.php');
        } else if (indexUrl.includes('/api/evopay')) {
          indexUrl = indexUrl.replace('/api/evopay', '/api/evopay/index.php');
        }
        // Garante que há barra entre index.php e o path
        indexUrl = indexUrl.replace('/index.php', '/index.php/');
        indexUrl = indexUrl.replace('//', '/');
        indexUrl = indexUrl.replace(':/', '://');
        
        try {
          const indexResponse = await fetch(indexUrl, options);
          if (indexResponse.ok) {
            console.warn('EvoPay: index.php funcionou!');
            return indexResponse;
          }
        } catch (indexError) {
          console.warn('EvoPay: index.php também não funcionou');
        }
        
        // Se index.php não funcionou, em produção/mobile NÃO tenta API direta
        if (!isProduction && !isMobile) {
          console.warn(`EvoPay: Tentando API direta para ${url}...`);
          const directUrl = `${this.directApiUrl}${url}`;
          
          try {
            const directResponse = await fetch(directUrl, options);
            
            if (directResponse.ok) {
              console.warn('EvoPay: API direta funcionou! Upload do proxy PHP ainda é recomendado para evitar CORS.');
              return directResponse;
            } else {
              throw new Error(`API direta retornou ${directResponse.status}`);
            }
          } catch (directError) {
            console.error('EvoPay: API direta também falhou:', directError);
            throw new Error(`Proxy PHP não encontrado (404). Faça upload de /api/evopay/proxy.php para o servidor. Erro direto: ${directError.message}`);
          }
        } else {
          // Em produção/mobile, não tenta API direta (sempre usa proxy)
          throw new Error(`🚨 Proxy PHP não encontrado (404). Verifique se os arquivos estão em /api/evopay/ no servidor.\n\n📁 Arquivos necessários:\n- /api/evopay/proxy.php\n- /api/evopay/.htaccess\n\n🔗 Teste manualmente: https://tkttok.shop/api/evopay/proxy.php`);
        }
      }
      
      return response;
    } catch (error) {
      // Se é erro de rede e estamos usando proxy, tenta direto apenas em desenvolvimento
      if ((error.message.includes('Failed to fetch') || error.message.includes('Load failed')) && 
          this.apiUrl.includes('/api/evopay') && !isProduction && !isMobile) {
        console.warn(`EvoPay: Erro de rede com proxy, tentando API direta para ${url}...`);
        const directUrl = `${this.directApiUrl}${url}`;
        
        try {
          const directResponse = await fetch(directUrl, options);
          if (directResponse.ok) {
            console.warn('EvoPay: API direta funcionou como fallback!');
            return directResponse;
          }
        } catch (directError) {
          // Se ambos falharem, lança o erro original
        }
      }
      
      throw error;
    }
  }

  /**
   * Inicializa a integração EvoPay
   */
  async init() {
    if (!this.apiKey) {
      console.error('EvoPay: API Key não configurada!');
      return false;
    }
    
    console.log('EvoPay: Inicializando integração...');
    
    try {
      // Testa a conexão verificando o saldo
      const balance = await this.getBalance();
      console.log('EvoPay: Conexão estabelecida. Saldo:', balance);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('EvoPay: Erro ao inicializar:', error);
      return false;
    }
  }

  /**
   * Verifica o saldo da conta
   */
  async getBalance() {
    try {
      const response = await this.fetchWithFallback('/account/balance', {
        method: 'GET',
        headers: {
          'API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar saldo: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Mensagens mais claras para mobile e produção
      if (error.message.includes('Load failed') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const currentHost = window.location.hostname;
        const isProduction = !currentHost.includes('localhost') && 
                             !currentHost.includes('127.0.0.1') && 
                             currentHost !== '192.168.0.204' &&
                             !currentHost.match(/^192\.168\./);
        
        if (isProduction && this.apiUrl.includes('pix.evopay.cash')) {
          throw new Error(`Erro de conexão em produção: A API EvoPay pode não permitir CORS direto. Considere criar um proxy no servidor ou usar backend.`);
        } else if (isMobile && (this.apiUrl.includes('localhost') || this.apiUrl.includes('127.0.0.1'))) {
          throw new Error(`Erro de conexão: No mobile, use o IP da rede (ex: http://${currentHost}:8001) em vez de localhost`);
        } else {
          throw new Error(`Erro de conexão: Verifique se o proxy está acessível em ${this.apiUrl}`);
        }
      }
      throw error;
    }
  }

  /**
   * Cria um pagamento PIX
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} Dados do pagamento criado (incluindo QR Code)
   */
  async createPixPayment(paymentData) {
    if (!this.initialized) {
      await this.init();
    }

    const {
      amount,
      productName,
      customerName,
      customerEmail,
      customerPhone,
      customerDocument,
      customerAddress,
      orderId
    } = paymentData;

    console.log('EvoPay: Criando pagamento PIX...', { amount, productName });

    try {
      // Timeout maior para mobile (30 segundos)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const timeout = isMobile ? 30000 : 15000;
      
      // AbortController para timeout (com fallback para browsers antigos)
      let controller = null;
      let timeoutId = null;
      
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        timeoutId = setTimeout(() => {
          if (controller) controller.abort();
        }, timeout);
      }
      
      let response;
      try {
        const fetchOptions = {
          method: 'POST',
          headers: {
            'API-Key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            callbackUrl: window.location.origin + '/payment-callback'
          })
        };
        
        // Adiciona signal apenas se AbortController estiver disponível
        if (controller) {
          fetchOptions.signal = controller.signal;
        }
        
        response = await this.fetchWithFallback('/pix', fetchOptions);
        
        if (timeoutId) clearTimeout(timeoutId);
      } catch (fetchError) {
        if (timeoutId) clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Tempo de conexão esgotado. Verifique sua internet e tente novamente.');
        }
        throw fetchError;
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `Erro HTTP: ${response.status}` };
        }
        throw new Error(errorData.message || errorData.error || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('EvoPay: Pagamento criado com sucesso!', data);
      console.log('EvoPay: Campos disponíveis na resposta:', Object.keys(data));
      console.log('EvoPay: Verificando QR Code em diferentes campos...');

      // Formata o QR Code base64 com o prefixo necessário
      // Tenta múltiplos campos possíveis na resposta da API
      let qrCodeFormatted = null;
      
      // Lista de campos possíveis para o QR code
      const qrCodeFields = [
        'qrCodeBase64',
        'qrCode',
        'qr_code_base64',
        'qr_code',
        'qrcode',
        'qrcodeBase64',
        'pixQrCode',
        'pix_qr_code',
        'qrCodeImage',
        'qrCodeData',
        'image',
        'qr_image',
        'brCodeImage'
      ];
      
      // Procura o QR code em todos os campos possíveis
      for (const field of qrCodeFields) {
        if (data[field]) {
          console.log(`EvoPay: QR Code encontrado no campo: ${field}`);
          qrCodeFormatted = data[field];
          break;
        }
      }
      
      // Se não encontrou em campos diretos, verifica em objetos aninhados
      if (!qrCodeFormatted) {
        if (data.pix && data.pix.qrCode) {
          console.log('EvoPay: QR Code encontrado em data.pix.qrCode');
          qrCodeFormatted = data.pix.qrCode;
        } else if (data.payment && data.payment.qrCode) {
          console.log('EvoPay: QR Code encontrado em data.payment.qrCode');
          qrCodeFormatted = data.payment.qrCode;
        } else if (data.data && data.data.qrCode) {
          console.log('EvoPay: QR Code encontrado em data.data.qrCode');
          qrCodeFormatted = data.data.qrCode;
        }
      }
      
      // Log de debug se não encontrou QR code
      if (!qrCodeFormatted) {
        console.warn('EvoPay: ⚠️ QR Code não encontrado na resposta da API!');
        console.warn('EvoPay: Resposta completa:', JSON.stringify(data, null, 2));
        
        // Tenta gerar QR code a partir do código PIX copia e cola
        const pixCode = data.qrCodeText || data.pixCopyPaste || data.pix_copy_paste || data.brCode || data.br_code || data.pix_code;
        if (pixCode) {
          console.log('EvoPay: Tentando gerar QR Code a partir do código PIX...');
          qrCodeFormatted = await generateQrCodeFromPixCode(pixCode);
          if (qrCodeFormatted) {
            console.log('EvoPay: ✅ QR Code gerado com sucesso a partir do código PIX!');
          } else {
            console.warn('EvoPay: Não foi possível gerar QR Code a partir do código PIX');
          }
        } else {
          console.warn('EvoPay: Código PIX também não encontrado na resposta');
        }
      } else {
        console.log('EvoPay: ✅ QR Code encontrado! Formatando...');
      }
      
      // Formata o QR code se encontrado
      if (qrCodeFormatted) {
        // Remove espaços em branco e quebras de linha
        qrCodeFormatted = qrCodeFormatted.trim().replace(/\s/g, '');
        
        // Adiciona prefixo data:image se não tiver
        if (!qrCodeFormatted.startsWith('data:image')) {
          // Verifica se já é base64 puro (sem prefixo)
          if (qrCodeFormatted.match(/^[A-Za-z0-9+/=]+$/)) {
            qrCodeFormatted = `data:image/png;base64,${qrCodeFormatted}`;
            console.log('EvoPay: Prefixo data:image adicionado ao QR Code');
          } else {
            console.warn('EvoPay: QR Code em formato desconhecido:', qrCodeFormatted.substring(0, 50) + '...');
          }
        }
      }

      // Retorna no formato esperado pela aplicação
      return {
        success: true,
        paymentId: data.id || data.payment_id,
        qrCode: qrCodeFormatted,
        qrCodeUrl: data.qrCodeUrl || data.qr_code_url || data.qrcode_url,
        pixCopyPaste: data.qrCodeText || data.pixCopyPaste || data.pix_copy_paste || data.brCode || data.br_code || data.pix_code,
        expiresAt: data.expiresAt || data.expires_at,
        status: data.status,
        amount: data.amount,
        createdAt: data.createdAt || data.created_at,
        rawData: data
      };
    } catch (error) {
      console.error('EvoPay: Erro ao criar pagamento:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        apiUrl: this.apiUrl
      });
      
      // Mensagens de erro mais amigáveis para mobile
      let friendlyMessage = error.message;
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        friendlyMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('Tempo de conexão')) {
        friendlyMessage = error.message; // Já é amigável
      } else if (error.message.includes('CORS') || error.message.includes('CORS policy')) {
        friendlyMessage = 'Erro de conexão com o servidor. Tente novamente.';
      } else if (!error.message || error.message.includes('undefined')) {
        friendlyMessage = 'Erro ao processar pagamento. Tente novamente.';
      }
      
      const enhancedError = new Error(friendlyMessage);
      enhancedError.originalError = error;
      enhancedError.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      throw enhancedError;
    }
  }

  /**
   * Verifica o status de um pagamento
   * @param {string} paymentId - ID do pagamento
   * @returns {Promise<Object>} Status do pagamento
   */
  async checkPaymentStatus(paymentId) {
    if (!this.initialized) {
      await this.init();
    }

    console.log('EvoPay: Verificando status do pagamento:', paymentId);

    try {
      // Busca na lista de transações (não existe endpoint /pix/{id})
      let response;
      try {
        response = await this.fetchWithFallback('/account/transactions?limit=100&type=DEPOSIT', {
          method: 'GET',
          headers: {
            'API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao verificar pagamento: ${response.status}`);
        }
      } catch (fetchError) {
        // Tratamento específico para erros de conexão
        if (fetchError.message.includes('Load failed') || fetchError.message.includes('Failed to fetch') || fetchError.name === 'TypeError') {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          const currentHost = window.location.hostname;
          
          if (isMobile && (this.apiUrl.includes('localhost') || this.apiUrl.includes('127.0.0.1'))) {
            throw new Error(`Erro de conexão: No mobile, use o IP da rede (ex: http://${currentHost}:8001) em vez de localhost`);
          } else {
            throw new Error(`Erro de conexão ao verificar pagamento: Verifique se o proxy está acessível em ${this.apiUrl}`);
          }
        }
        throw fetchError;
      }

      const data = await response.json();
      
      // A API pode retornar array diretamente ou objeto com transactions
      let transactions = Array.isArray(data) ? data : (data.transactions || data.data || []);
      
      // Encontra o pagamento específico na lista
      const transaction = transactions.find(t => 
        t.id === paymentId || 
        t.paymentId === paymentId ||
        t.transactionId === paymentId
      );
      
      if (!transaction) {
        // Se não encontrou, pode ser que ainda não esteja na lista
        // Retorna status PENDING como padrão
        console.warn('EvoPay: Pagamento não encontrado na lista, assumindo PENDING:', paymentId);
        return {
          success: true,
          paymentId: paymentId,
          status: 'PENDING',
          paid: false,
          amount: null,
          paidAt: null,
          qrCodeUrl: null,
          qrCodeBase64: null,
          qrCodeText: null,
          rawData: null,
          note: 'Pagamento não encontrado na lista de transações (pode estar pendente ou recém criado)'
        };
      }

      console.log('EvoPay: Status do pagamento:', transaction.status || transaction.state);

      // Normaliza status (pode ser status, state, ou outro campo)
      const status = transaction.status || transaction.state || 'PENDING';
      const isCompleted = status === 'COMPLETED' || status === 'COMPLETE' || status === 'PAID';

      return {
        success: true,
        paymentId: transaction.id || transaction.paymentId || paymentId,
        status: status,
        paid: isCompleted,
        amount: transaction.amount || transaction.amountWithTax || null,
        paidAt: transaction.updatedAt || transaction.paidAt || transaction.createdAt || null,
        qrCodeUrl: transaction.qrCodeUrl || null,
        qrCodeBase64: transaction.qrCodeBase64 || null,
        qrCodeText: transaction.qrCodeText || null,
        rawData: transaction
      };
    } catch (error) {
      console.error('EvoPay: Erro ao verificar status:', error);
      
      // Retorna um status padrão em caso de erro, não lança exceção
      return {
        success: false,
        paymentId: paymentId,
        status: 'UNKNOWN',
        paid: false,
        amount: null,
        paidAt: null,
        qrCodeUrl: null,
        qrCodeBase64: null,
        qrCodeText: null,
        rawData: null,
        error: error.message
      };
    }
  }

  /**
   * Lista todos os pagamentos
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Array>} Lista de pagamentos
   */
  async listPayments(filters = {}) {
    if (!this.initialized) {
      await this.init();
    }

    // Adiciona filtros padrão se não fornecidos
    const defaultFilters = {
      limit: 10,
      page: 1,
      type: 'DEPOSIT',
      ...filters
    };

    const queryParams = new URLSearchParams(defaultFilters).toString();
    const url = `${this.apiUrl}/account/transactions${queryParams ? '?' + queryParams : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao listar pagamentos: ${response.status}`);
    }

    return await response.json();
  }
}

/**
 * Intercepta as chamadas do Supabase e redireciona para EvoPay
 */
class SupabaseToEvoPay {
  constructor(evopay) {
    this.evopay = evopay;
    this.setupInterceptor();
  }

  setupInterceptor() {
    console.log('EvoPay: Configurando interceptor do Supabase...');
    
    // Intercepta o objeto global do Supabase se existir
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      
      // Verifica se é uma chamada para create-payment ou check-payment
      if (typeof url === 'string' && url.includes('/functions/v1/')) {
        if (url.includes('create-payment')) {
          console.log('EvoPay: Interceptando create-payment', {
            url: url,
            hasOptions: !!options,
            hasBody: !!(options && options.body),
            method: options && options.method
          });
          
          try {
            const response = await this.handleCreatePayment(options);
            
            // Log da resposta
            const responseClone = response.clone();
            responseClone.json().then(data => {
              console.log('EvoPay: Resposta do handleCreatePayment:', {
                success: data.success,
                hasPaymentId: !!data.paymentId,
                hasQrCode: !!data.qrCode,
                error: data.error
              });
            }).catch(() => {});
            
            return response;
          } catch (error) {
            console.error('EvoPay: Erro no interceptor:', error);
            // Retorna resposta de erro válida
            return new Response(JSON.stringify({
              success: false,
              error: error.message,
              paymentId: null,
              qrCode: null
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        } else if (url.includes('check-payment')) {
          console.log('EvoPay: Interceptando check-payment');
          return this.handleCheckPayment(options);
        }
      }
      
      // Para outras chamadas, usa o fetch original
      return originalFetch.apply(window, args);
    };
  }

  async handleCreatePayment(options) {
    try {
      // Verificar se options.body existe
      if (!options || !options.body) {
        throw new Error('Corpo da requisição não fornecido');
      }
      
      let body;
      try {
        body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      } catch (parseError) {
        throw new Error('Erro ao parsear corpo da requisição: ' + parseError.message);
      }
      
      // Log detalhado para debugging mobile
      console.log('EvoPay: Criando pagamento (mobile-friendly)...', {
        hasBody: !!body,
        amount: body.amount,
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      });
      
      const result = await this.evopay.createPixPayment(body);
      
      // Garantir que result tem success: true
      if (!result.success) {
        result.success = true;
      }
      
      console.log('EvoPay: Pagamento criado com sucesso!', {
        paymentId: result.paymentId,
        hasQrCode: !!result.qrCode
      });
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } catch (error) {
      console.error('EvoPay: Erro ao criar pagamento:', {
        message: error.message,
        stack: error.stack,
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      });
      
      // Retorna status 200 mas com success: false para não quebrar o fluxo
      // O React pode tratar o erro baseado no campo success
      return new Response(JSON.stringify({
        success: false,
        error: error.message || 'Erro desconhecido ao criar pagamento',
        errorType: error.name || 'Error',
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        timestamp: new Date().toISOString(),
        // Campos esperados pelo React
        paymentId: null,
        qrCode: null,
        qrCodeUrl: null,
        pixCopyPaste: null
      }), {
        status: 200, // Retorna 200 para não quebrar, mas com success: false
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
  }

  async handleCheckPayment(options) {
    try {
      const body = JSON.parse(options.body);
      const result = await this.evopay.checkPaymentStatus(body.paymentId);
      
      // Se result.success é false, retorna status 404 mas ainda retorna os dados
      const statusCode = result.success ? 200 : 404;
      
      return new Response(JSON.stringify(result), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Em caso de erro inesperado, retorna um objeto válido
      console.error('EvoPay: Erro no handleCheckPayment:', error);
      return new Response(JSON.stringify({
        success: false,
        paymentId: options.body ? JSON.parse(options.body).paymentId : null,
        status: 'UNKNOWN',
        paid: false,
        error: error.message
      }), {
        status: 200, // Retorna 200 mesmo com erro para não quebrar o fluxo
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Exporta para uso global
window.EvoPay = EvoPay;
window.SupabaseToEvoPay = SupabaseToEvoPay;

// Auto-inicialização se API Key estiver configurada
(function() {
  console.log('EvoPay: Script carregado!');
  
  // Função para detectar e corrigir URL da API
  function detectAndFixApiUrl(originalUrl) {
    if (!originalUrl) return originalUrl;
    
    const currentHost = window.location.hostname;
    const protocol = window.location.protocol;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Detecta se está em produção (qualquer domínio que não seja localhost/IP local)
    // Inclui detecção específica para tkttok.shop
    const isLocalhost = currentHost === 'localhost' || 
                        currentHost === '127.0.0.1' || 
                        currentHost.match(/^192\.168\./) ||
                        currentHost.match(/^10\./) ||
                        currentHost.match(/^172\.(1[6-9]|2[0-9]|3[01])\./);
    
    const isProduction = !isLocalhost || currentHost.includes('tkttok.shop');
    
    console.log('EvoPay: Detecção de ambiente:', {
      currentHost,
      isProduction,
      isMobile,
      originalUrl,
      protocol,
      isTkttokShop: currentHost.includes('tkttok.shop')
    });
    
    // Em produção OU mobile OU tkttok.shop, SEMPRE usa o proxy PHP no mesmo domínio (resolve CORS)
    if ((isProduction || isMobile || currentHost.includes('tkttok.shop')) && 
        (originalUrl.includes('localhost') || originalUrl.includes('127.0.0.1') || originalUrl.includes(':8001'))) {
      const productionUrl = `${protocol}//${currentHost}/api/evopay`;
      console.log('EvoPay: 🔄 Modo produção/mobile/tkttok.shop detectado, usando proxy PHP:', productionUrl);
      console.log('EvoPay: ✅ O proxy PHP resolve problemas de CORS automaticamente');
      
      // Atualiza a meta tag se existir
      const apiUrlMeta = document.querySelector('meta[name="evopay-api-url"]');
      if (apiUrlMeta) {
        apiUrlMeta.setAttribute('content', productionUrl);
      }
      
      return productionUrl;
    }
    
    // Se está usando localhost e a página foi acessada via IP da rede (desenvolvimento desktop)
    if (!isMobile && !currentHost.includes('tkttok.shop') && (originalUrl.includes('localhost') || originalUrl.includes('127.0.0.1'))) {
      // Se está acessando via IP da rede (ex: 192.168.x.x)
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(currentHost)) {
        // Substitui localhost pelo IP da rede
        let fixedUrl = originalUrl.replace('localhost', currentHost);
        fixedUrl = fixedUrl.replace('127.0.0.1', currentHost);
        
        // Ajusta a porta para 8001 (proxy)
        // Remove qualquer porta existente e adiciona :8001
        fixedUrl = fixedUrl.replace(/:\d+/, '');
        fixedUrl = fixedUrl + ':8001';
        
        console.log('EvoPay: URL corrigida para desenvolvimento (IP):', fixedUrl);
        console.log('EvoPay: Hostname atual:', currentHost);
        
        // Atualiza a meta tag se existir
        const apiUrlMeta = document.querySelector('meta[name="evopay-api-url"]');
        if (apiUrlMeta) {
          apiUrlMeta.setAttribute('content', fixedUrl);
        }
        
        return fixedUrl;
      }
    }
    
    // Se já está configurado para usar /api/evopay, mantém
    if (originalUrl.includes('/api/evopay')) {
      console.log('EvoPay: URL já configurada para proxy PHP:', originalUrl);
      return originalUrl;
    }
    
    return originalUrl;
  }
  
  // Verifica se a API Key está configurada nas variáveis de ambiente ou meta tags
  const apiKeyMeta = document.querySelector('meta[name="evopay-api-key"]');
  const apiUrlMeta = document.querySelector('meta[name="evopay-api-url"]');
  
  const apiKey = apiKeyMeta ? apiKeyMeta.content : window.EVOPAY_API_KEY;
  let apiUrl = apiUrlMeta ? apiUrlMeta.content : window.EVOPAY_API_URL;
  
  // Detecta e corrige URL automaticamente para mobile
  apiUrl = detectAndFixApiUrl(apiUrl);
  
  if (apiKey) {
    console.log('EvoPay: API Key encontrada, inicializando...');
    console.log('EvoPay: API URL:', apiUrl || 'https://api.evopay.cash (padrão)');
    console.log('EvoPay: Hostname atual:', window.location.hostname);
    console.log('EvoPay: É mobile?', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    const evopay = new EvoPay(apiKey, apiUrl);
    const interceptor = new SupabaseToEvoPay(evopay);
    
    // Atualiza a URL da API na instância se foi corrigida
    if (apiUrl !== (apiUrlMeta ? apiUrlMeta.content : window.EVOPAY_API_URL)) {
      evopay.apiUrl = apiUrl;
      console.log('EvoPay: URL da API atualizada na instância:', evopay.apiUrl);
    }
    
    // Disponibiliza globalmente
    window.evopayInstance = evopay;
    window.evopayInterceptor = interceptor;
    
    // Inicializa com retry em caso de falha
    evopay.init().then(success => {
      if (success) {
        console.log('✅ EvoPay: Integração ativa e funcionando!');
      } else {
        console.warn('⚠️ EvoPay: Falha na inicialização');
        console.warn('⚠️ Tentando novamente em 2 segundos...');
        
        // Tenta novamente após 2 segundos
        setTimeout(() => {
          evopay.init().then(retrySuccess => {
            if (retrySuccess) {
              console.log('✅ EvoPay: Integração ativa após retry!');
            } else {
              console.error('❌ EvoPay: Falha persistente na inicialização');
              console.error('❌ Verifique se o proxy está acessível em:', apiUrl);
              console.error('💡 Dica: No mobile, use o IP da rede em vez de localhost');
            }
          });
        }, 2000);
      }
    }).catch(error => {
      console.error('❌ EvoPay: Erro na inicialização:', error.message);
      console.error('💡 Dica: Verifique se a URL da API está correta:', apiUrl);
      console.error('💡 No mobile, use o IP da rede (ex: http://192.168.0.204:8001)');
    });
  } else {
    console.warn('⚠️ EvoPay: API Key não configurada. Configure através de meta tag ou window.EVOPAY_API_KEY');
  }
})();

