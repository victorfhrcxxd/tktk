/**
 * EvoPay PIX Integration
 * Integração customizada com a API EvoPay para pagamentos PIX
 */

class EvoPay {
  constructor(apiKey, apiUrl = 'https://api.evopay.cash') {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.initialized = false;
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
    const response = await fetch(`${this.apiUrl}/account/balance`, {
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
      const response = await fetch(`${this.apiUrl}/pix`, {
        method: 'POST',
        headers: {
          'API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          callbackUrl: window.location.origin + '/payment-callback'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('EvoPay: Pagamento criado com sucesso!', data);

      // Formata o QR Code base64 com o prefixo necessário
      let qrCodeFormatted = data.qrCodeBase64 || data.qrCode || data.qr_code_base64 || data.qr_code;
      if (qrCodeFormatted && !qrCodeFormatted.startsWith('data:image')) {
        qrCodeFormatted = `data:image/png;base64,${qrCodeFormatted}`;
      }

      // Retorna no formato esperado pela aplicação
      return {
        success: true,
        paymentId: data.id || data.payment_id,
        qrCode: qrCodeFormatted,
        qrCodeUrl: data.qrCodeUrl || data.qr_code_url,
        pixCopyPaste: data.qrCodeText || data.pixCopyPaste || data.pix_copy_paste || data.brCode,
        expiresAt: data.expiresAt || data.expires_at,
        status: data.status,
        amount: data.amount,
        createdAt: data.createdAt,
        rawData: data
      };
    } catch (error) {
      console.error('EvoPay: Erro ao criar pagamento:', error);
      throw error;
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
      const response = await fetch(`${this.apiUrl}/account/transactions?limit=100&type=DEPOSIT`, {
        method: 'GET',
        headers: {
          'API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar pagamento: ${response.status}`);
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
          console.log('EvoPay: Interceptando create-payment');
          return this.handleCreatePayment(options);
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
      const body = JSON.parse(options.body);
      const result = await this.evopay.createPixPayment(body);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
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
  
  // Verifica se a API Key está configurada nas variáveis de ambiente ou meta tags
  const apiKeyMeta = document.querySelector('meta[name="evopay-api-key"]');
  const apiUrlMeta = document.querySelector('meta[name="evopay-api-url"]');
  
  const apiKey = apiKeyMeta ? apiKeyMeta.content : window.EVOPAY_API_KEY;
  const apiUrl = apiUrlMeta ? apiUrlMeta.content : window.EVOPAY_API_URL;
  
  if (apiKey) {
    console.log('EvoPay: API Key encontrada, inicializando...');
    console.log('EvoPay: API URL:', apiUrl || 'https://api.evopay.cash (padrão)');
    
    const evopay = new EvoPay(apiKey, apiUrl);
    const interceptor = new SupabaseToEvoPay(evopay);
    
    // Disponibiliza globalmente
    window.evopayInstance = evopay;
    window.evopayInterceptor = interceptor;
    
    // Inicializa
    evopay.init().then(success => {
      if (success) {
        console.log('✅ EvoPay: Integração ativa e funcionando!');
      } else {
        console.warn('⚠️ EvoPay: Falha na inicialização');
      }
    }).catch(error => {
      console.error('❌ EvoPay: Erro na inicialização:', error.message);
      console.error('💡 Dica: Verifique se a URL da API está correta e se você tem acesso à internet');
    });
  } else {
    console.warn('⚠️ EvoPay: API Key não configurada. Configure através de meta tag ou window.EVOPAY_API_KEY');
  }
})();

