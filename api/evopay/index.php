<?php
/**
 * Proxy EvoPay para Produção (PHP) - index.php
 * Funciona quando acessado via /api/evopay/ sem especificar arquivo
 * 
 * Como usar:
 * 1. Faça upload deste arquivo para: /api/evopay/index.php
 * 2. Faça upload também de proxy.php para: /api/evopay/proxy.php
 * 3. Configure no index.html:
 *    <meta name="evopay-api-url" content="https://tkttok.shop/api/evopay">
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

// Get path from URL - funciona com ou sem .htaccess
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME']; // /api/evopay/index.php

// Remove query string temporariamente para processar o path
$queryString = $_SERVER['QUERY_STRING'] ?? '';
$requestUriWithoutQuery = strpos($requestUri, '?') !== false 
    ? substr($requestUri, 0, strpos($requestUri, '?')) 
    : $requestUri;

// Se está acessando via /api/evopay/index.php/path ou /api/evopay/path
if (strpos($requestUriWithoutQuery, $scriptName) === 0) {
    // Remove o script name e a barra seguinte
    $path = substr($requestUriWithoutQuery, strlen($scriptName));
    $path = ltrim($path, '/');
} else {
    // Remove /api/evopay do início
    $path = preg_replace('#^/api/evopay#', '', $requestUriWithoutQuery);
    $path = ltrim($path, '/');
}

// Remove index.php se ainda estiver no path
$path = str_replace('index.php', '', $path);
$path = str_replace('proxy.php', '', $path);
$path = ltrim($path, '/');

// Build full URL
$url = EVOPAY_API_URL;
if (!empty($path)) {
    $url .= '/' . $path;
}
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
    echo json_encode(['error' => $error, 'url' => $url]);
    exit;
}

// Return response
http_response_code($httpCode);
echo $response;
?>

