<?php
/**
 * Proxy EvoPay para Produção (PHP)
 * Versão alternativa: index.php
 * 
 * Use esta versão se o servidor não suportar proxy.php diretamente
 * Faça upload deste arquivo para: /api/evopay/index.php
 */

// Headers CORS primeiro (antes de qualquer output)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, API-Key, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

const EVOPAY_API_URL = 'https://pix.evopay.cash/v1';
const API_KEY = '5aef8004-9644-4dda-85a4-163fae7439ae';

// Get path from URL
$requestUri = $_SERVER['REQUEST_URI'];
$queryString = $_SERVER['QUERY_STRING'] ?? '';

// Remove query string from path
$path = strtok($requestUri, '?');

// Remove /api/evopay from the beginning
$path = preg_replace('#^/api/evopay/?#', '', $path);

// Remove /index.php if present
$path = preg_replace('#/index\.php$#', '', $path);

// Remove leading/trailing slashes except for root
$path = trim($path, '/');

// Build full URL to EvoPay API
$apiPath = $path ? '/' . $path : '';
$url = EVOPAY_API_URL . $apiPath;

// Add query string if present
if (!empty($queryString)) {
    $url .= '?' . $queryString;
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
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Add body for POST/PUT/PATCH
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH']) && !empty($body)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'cURL Error',
        'message' => $error,
        'url' => $url
    ], JSON_PRETTY_PRINT);
    exit;
}

// Handle HTTP errors
if ($httpCode >= 400) {
    // Try to parse error response
    $errorData = json_decode($response, true);
    if ($errorData) {
        http_response_code($httpCode);
        echo json_encode($errorData, JSON_PRETTY_PRINT);
    } else {
        http_response_code($httpCode);
        echo json_encode([
            'error' => 'HTTP Error',
            'status' => $httpCode,
            'message' => $response ?: 'No response body',
            'url' => $url
        ], JSON_PRETTY_PRINT);
    }
    exit;
}

// Success - return response
http_response_code($httpCode);
echo $response;
?>

