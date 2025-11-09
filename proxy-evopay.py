#!/usr/bin/env python3
"""
Proxy para EvoPay API
Resolve problemas de CORS entre localhost e a API EvoPay
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.error

# Configurações
EVOPAY_API_URL = "https://pix.evopay.cash/v1"
API_KEY = "5aef8004-9644-4dda-85a4-163fae7439ae"
PORT = 8001

class ProxyHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        """Adiciona headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, API-Key')
        self.send_header('Access-Control-Max-Age', '86400')
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """Proxy GET requests"""
        try:
            # Monta URL completa
            target_url = f"{EVOPAY_API_URL}{self.path}"
            
            print(f"[PROXY] GET {target_url}")
            
            # Cria request
            req = urllib.request.Request(
                target_url,
                headers={'API-Key': API_KEY}
            )
            
            # Faz request
            with urllib.request.urlopen(req) as response:
                data = response.read()
                
                # Envia resposta
                self.send_response(response.status)
                self._send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
                
                print(f"[PROXY] ✅ Sucesso: {response.status}")
        
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"[PROXY] ❌ Erro HTTP {e.code}: {error_body}")
            
            self.send_response(e.code)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_body.encode())
        
        except Exception as e:
            print(f"[PROXY] ❌ Erro: {str(e)}")
            
            self.send_response(500)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_msg = json.dumps({'error': str(e)})
            self.wfile.write(error_msg.encode())
    
    def do_POST(self):
        """Proxy POST requests"""
        try:
            # Lê body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else b''
            
            # Monta URL completa
            target_url = f"{EVOPAY_API_URL}{self.path}"
            
            print(f"[PROXY] POST {target_url}")
            if body:
                print(f"[PROXY] Body: {body.decode('utf-8')}")
            
            # Cria request
            req = urllib.request.Request(
                target_url,
                data=body,
                headers={
                    'API-Key': API_KEY,
                    'Content-Type': 'application/json'
                },
                method='POST'
            )
            
            # Faz request
            with urllib.request.urlopen(req) as response:
                data = response.read()
                
                # Envia resposta
                self.send_response(response.status)
                self._send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
                
                print(f"[PROXY] ✅ Sucesso: {response.status}")
                print(f"[PROXY] Response: {data.decode('utf-8')}")
        
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"[PROXY] ❌ Erro HTTP {e.code}: {error_body}")
            
            self.send_response(e.code)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(error_body.encode())
        
        except Exception as e:
            print(f"[PROXY] ❌ Erro: {str(e)}")
            
            self.send_response(500)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_msg = json.dumps({'error': str(e)})
            self.wfile.write(error_msg.encode())
    
    def log_message(self, format, *args):
        """Desabilita logs automáticos"""
        pass

if __name__ == '__main__':
    print(f"🔄 Iniciando Proxy EvoPay na porta {PORT}...")
    print(f"📡 Redirecionando para: {EVOPAY_API_URL}")
    print(f"🔑 API Key configurada")
    print(f"✅ Proxy ativo!\n")
    
    server = HTTPServer(('0.0.0.0', PORT), ProxyHandler)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Proxy encerrado")
        server.shutdown()
