#!/bin/bash

# Script para iniciar servidor local do TikTok Shop

echo "🚀 Iniciando servidor local do TikTok Shop..."
echo ""
echo "📱 Site otimizado para mobile"
echo ""
echo "🌐 Acesse no navegador:"
echo "   http://localhost:8000"
echo ""
echo "💡 Para testar no celular:"
echo "   1. Certifique-se que o celular está na mesma rede Wi-Fi"
echo "   2. Use o endereço IP do seu Mac:"
echo "      http://$(ipconfig getifaddr en0):8000"
echo ""
echo "⏹️  Pressione Ctrl+C para parar o servidor"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd saveweb2zip-com-novembertktk-shop
python3 -m http.server 8000

