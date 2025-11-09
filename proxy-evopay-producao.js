/**
 * Proxy EvoPay para Produção
 * Use este arquivo se a API EvoPay não permitir CORS direto
 * 
 * Para Node.js/Express:
 */

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const EVOPAY_API_URL = 'https://pix.evopay.cash/v1';
const API_KEY = '5aef8004-9644-4dda-85a4-163fae7439ae';

// CORS para permitir requisições do frontend
app.use(cors());
app.use(express.json());

// Proxy para todas as rotas da EvoPay
app.all('/api/evopay/*', async (req, res) => {
  try {
    const path = req.path.replace('/api/evopay', '');
    const url = `${EVOPAY_API_URL}${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    
    console.log(`[PROXY] ${req.method} ${url}`);
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'API-Key': API_KEY,
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    
    res.status(response.status).json(data);
    console.log(`[PROXY] ✅ ${response.status}`);
  } catch (error) {
    console.error('[PROXY] ❌ Erro:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy EvoPay rodando na porta ${PORT}`);
  console.log(`📡 Redirecionando para: ${EVOPAY_API_URL}`);
});

/**
 * Para usar:
 * 
 * 1. Instale as dependências:
 *    npm install express node-fetch cors
 * 
 * 2. Inicie o servidor:
 *    node proxy-evopay-producao.js
 * 
 * 3. Configure no index.html:
 *    <meta name="evopay-api-url" content="https://seudominio.com/api/evopay">
 * 
 * OU use como Edge Function no Vercel/Netlify
 */

