<?php
/**
 * Arquivo de Teste do Proxy EvoPay
 * Acesse: https://tkttok.shop/api/evopay/test.php
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Teste Proxy EvoPay</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .test { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #4CAF50; }
        .error { border-left-color: #f44336; }
        .success { border-left-color: #4CAF50; }
        pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
        button { background: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
        button:hover { background: #45a049; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Teste do Proxy EvoPay</h1>
        
        <div class="test">
            <h3>1. Verificação de Arquivo</h3>
            <p><strong>Arquivo proxy.php existe:</strong> 
                <?php echo file_exists(__DIR__ . '/proxy.php') ? '✅ Sim' : '❌ Não'; ?>
            </p>
            <p><strong>Caminho:</strong> <?php echo __DIR__ . '/proxy.php'; ?></p>
        </div>

        <div class="test">
            <h3>2. Verificação de PHP</h3>
            <p><strong>Versão PHP:</strong> <?php echo phpversion(); ?></p>
            <p><strong>cURL habilitado:</strong> 
                <?php echo function_exists('curl_init') ? '✅ Sim' : '❌ Não'; ?>
            </p>
            <p><strong>allow_url_fopen:</strong> 
                <?php echo ini_get('allow_url_fopen') ? '✅ Habilitado' : '❌ Desabilitado'; ?>
            </p>
        </div>

        <div class="test">
            <h3>3. Teste de Conexão com EvoPay</h3>
            <button onclick="testConnection()">🔄 Testar Conexão</button>
            <div id="result" style="margin-top: 10px;"></div>
        </div>

        <div class="test">
            <h3>4. Informações do Servidor</h3>
            <pre><?php
                echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "\n";
                echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "\n";
                echo "DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "\n";
                echo "SERVER_NAME: " . ($_SERVER['SERVER_NAME'] ?? 'N/A') . "\n";
            ?></pre>
        </div>
    </div>

    <script>
        async function testConnection() {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>⏳ Testando conexão...</p>';
            
            try {
                const response = await fetch('/api/evopay/account/balance', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `
                        <div class="success">
                            <h4>✅ Conexão bem-sucedida!</h4>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="error">
                            <h4>❌ Erro na conexão</h4>
                            <p><strong>Status:</strong> ${response.status}</p>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                }
            } catch (error) {
                resultDiv.innerHTML = `
                    <div class="error">
                        <h4>❌ Erro ao conectar</h4>
                        <p><strong>Erro:</strong> ${error.message}</p>
                        <p><strong>Possíveis causas:</strong></p>
                        <ul>
                            <li>Arquivo proxy.php não existe</li>
                            <li>Servidor não está configurado corretamente</li>
                            <li>Problema de CORS</li>
                        </ul>
                    </div>
                `;
            }
        }
    </script>
</body>
</html>

