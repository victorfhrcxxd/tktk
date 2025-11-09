#!/usr/bin/env python3
"""
Servidor HTTP que redireciona todas as rotas para index.html
Permite que React Router funcione corretamente
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import os

class ReactRouterHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Remove query string
        path = self.path.split('?')[0]
        
        # Arquivos estáticos (CSS, JS, imagens, etc)
        if path.startswith('/css/') or path.startswith('/js/') or path.startswith('/assets/') or path.startswith('/images/'):
            return self.serve_static_file(path)
        
        # Pasta admin - serve arquivos diretamente
        if path.startswith('/admin/') or path == '/admin':
            # Se é /admin sem barra, redireciona para /admin/
            if path == '/admin':
                path = '/admin/'
            return self.serve_static_file(path)
        
        # Se o arquivo existe, serve normalmente
        file_path = os.path.join(os.path.dirname(__file__), path.lstrip('/'))
        if os.path.isfile(file_path):
            return self.serve_static_file(path)
        
        # Para todas as outras rotas, serve index.html (React Router)
        return self.serve_index()
    
    def serve_static_file(self, path):
        """Serve arquivos estáticos normalmente"""
        file_path = os.path.join(os.path.dirname(__file__), path.lstrip('/'))
        
        # Se é um diretório, tenta servir index.html
        if os.path.isdir(file_path):
            file_path = os.path.join(file_path, 'index.html')
        
        if not os.path.exists(file_path):
            self.send_error(404)
            return
        
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            
            # Determina content-type
            content_type = 'text/html'
            if path.endswith('.css'):
                content_type = 'text/css'
            elif path.endswith('.js'):
                content_type = 'application/javascript; charset=utf-8'
            elif path.endswith('.png'):
                content_type = 'image/png'
            elif path.endswith('.jpg') or path.endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif path.endswith('.webp'):
                content_type = 'image/webp'
            elif path.endswith('.svg'):
                content_type = 'image/svg+xml'
            elif path.endswith('.json'):
                content_type = 'application/json'
            elif path.endswith('.md'):
                content_type = 'text/markdown; charset=utf-8'
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            # Headers para evitar cache durante desenvolvimento
            if path.startswith('/admin/'):
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, str(e))
    
    def serve_index(self):
        """Serve index.html para todas as rotas (React Router)"""
        index_path = os.path.join(os.path.dirname(__file__), 'index.html')
        
        try:
            with open(index_path, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        """Customiza logs"""
        # Logs silenciados (descomente se quiser ver)
        # print(f"{self.address_string()} - {args[0]}")
        pass

def run_server(port=8000):
    """Inicia o servidor"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ReactRouterHandler)
    
    print("=" * 60)
    print("🚀 SERVIDOR REACT ROUTER INICIADO")
    print("=" * 60)
    print(f"📡 Servidor rodando em: http://localhost:{port}")
    print(f"📁 Diretório: {os.path.dirname(__file__)}")
    print()
    print("✅ Todas as rotas redirecionam para index.html")
    print("✅ React Router funcionará corretamente")
    print()
    print("🛑 Para parar: Ctrl+C")
    print("=" * 60)
    print()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor encerrado")
        httpd.server_close()

if __name__ == '__main__':
    run_server()

