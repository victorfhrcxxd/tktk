#!/bin/bash

# Script para iniciar servidor completo (site + proxy)
# Resolve problema de CORS da API EvoPay
# Usa servidor React Router para suportar rotas

echo "🚀 Iniciando servidores..."
echo ""

# Navega para o diretório correto
cd /Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop

# Função para limpar ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidores..."
    kill $PID_SITE 2>/dev/null
    kill $PID_PROXY 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Inicia o servidor do site com React Router (porta 8000)
echo "📱 Iniciando servidor React Router na porta 8000..."
python3 servidor-react-router.py > /dev/null 2>&1 &
PID_SITE=$!

sleep 1

# Inicia o proxy para API EvoPay (porta 8001)
echo "🔄 Iniciando proxy EvoPay na porta 8001..."
python3 proxy-evopay.py &
PID_PROXY=$!

sleep 2

# Obtém o IP local
IP_ADDRESS=$(ipconfig getifaddr en0 2>/dev/null || echo "N/A")

echo ""
echo "=" | sed 's/.*/&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&/'
echo "✅ SERVIDORES ATIVOS!"
echo "=" | sed 's/.*/&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&/'
echo ""
echo "📱 SITE:"
echo "   Local:  http://localhost:8000"
if [ "$IP_ADDRESS" != "N/A" ]; then
    echo "   Rede:   http://$IP_ADDRESS:8000"
fi
echo ""
echo "🔄 PROXY API:"
echo "   Local:  http://localhost:8001"
if [ "$IP_ADDRESS" != "N/A" ]; then
    echo "   Rede:   http://$IP_ADDRESS:8001"
fi
echo ""
echo "=" | sed 's/.*/&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&/'
echo ""
echo "💡 O proxy resolve o erro de CORS automaticamente!"
echo "🛑 Para parar: Ctrl+C"
echo ""

# Aguarda até o usuário parar
wait

