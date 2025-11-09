#!/bin/bash

# Script para aplicar correções ao projeto
# Atualiza index.html para usar a versão V2 do script de limpeza

echo "🔧 Aplicando correções ao projeto..."
echo ""

cd /Users/louiseney/Downloads/Tiktok/saveweb2zip-com-novembertktk-shop

# Backup do index.html atual
echo "📦 Criando backup do index.html..."
cp index.html index-backup-$(date +%Y%m%d-%H%M%S).html
echo "✅ Backup criado"
echo ""

# Verifica se V2 existe
if [ ! -f "js/limpar-pagina-inicial-v2.js" ]; then
    echo "❌ Erro: js/limpar-pagina-inicial-v2.js não encontrado!"
    exit 1
fi

# Substitui V1 por V2 no index.html
echo "🔄 Atualizando index.html para usar V2..."
sed -i.bak 's/limpar-pagina-inicial\.js/limpar-pagina-inicial-v2.js/g' index.html

if [ $? -eq 0 ]; then
    echo "✅ index.html atualizado com sucesso!"
    rm index.html.bak 2>/dev/null
else
    echo "❌ Erro ao atualizar index.html"
    exit 1
fi

echo ""
echo "=" | sed 's/.*/&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&/'
echo "✅ CORREÇÕES APLICADAS COM SUCESSO!"
echo "=" | sed 's/.*/&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&/'
echo ""
echo "📝 Mudanças aplicadas:"
echo "   - Script de limpeza atualizado para V2"
echo "   - Backup do index.html criado"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Reinicie o servidor (ou recarregue a página)"
echo "   2. Abra o console do navegador (F12)"
echo "   3. Verifique se aparece '🧹 Limpeza da página inicial V2'"
echo ""
echo "💡 Para reverter:"
echo "   Copie o backup de volta para index.html"
echo ""

# Lista backups
echo "📦 Backups disponíveis:"
ls -lh index-backup-*.html 2>/dev/null | awk '{print "   "$9" ("$5")"}'
echo ""

