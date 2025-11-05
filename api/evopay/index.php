<?php
/**
 * Proxy EvoPay para Produção (PHP)
 * Versão alternativa: index.php
 * 
 * Use esta versão se o servidor não suportar proxy.php diretamente
 * Faça upload deste arquivo para: /api/evopay/index.php
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, API-Key');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

const EVOPAY_API_URL = 'https://pix.evopay.cash/v1';
const API_KEY = '5aef8004-9644-4dda-85a4-163fae7439ae';

// Get path from URL
$path = $_SERVER['REQUEST_URI'];

// Remove /api/evopay from the beginning
$path = preg_replace('#^/api/evopay#', '', $path);

// Remove /index.php if present
$path = str_replace('/index.php', '', $path);

// If path is empty or just '/', default to root
if (empty($path) || $path === '/') {
    $path = '';
}

// Build full URL
$url = EVOPAY_API_URL . $path;
if (!empty($_SERVER['QUERY_STRING'])) {
    $url .= '?' . $_SERVER['QUERY_STRING'];
}

// Get request body
$body = file_get_contents('php://input');

// Prepare headers
$headers = [
    'API-Key: ' . API_KEY,
    'Content-Type: application/json'
];

// Add API-Key from request if present
if (isset($_SERVER['HTTP_API_KEY'])) {
    $headers[0] = 'API-Key: ' . $_SERVER['HTTP_API_KEY'];
}

// Initialize cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Add body for POST/PUT
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !empty($body)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Handle errors
if ($error) {
    http_response_code(500);
    echo json_encode(['error' => $error]);
    exit;
}

// Return response
http_response_code($httpCode);
echo $response;
?>

