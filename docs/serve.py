#!/usr/bin/env python3
"""
Simple HTTP server for SPA (Single Page Application) routing.
Serves index.html for all routes that don't match existing files.
"""

import http.server
import socketserver
import os
import urllib.parse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Parse the URL path
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # If path is empty, serve index.html
        if not path:
            path = 'index.html'
        
        # Check if the file exists
        if os.path.exists(path) and os.path.isfile(path):
            # Serve the actual file
            super().do_GET()
        else:
            # For SPA routing, serve index.html for all other routes
            self.path = '/index.html'
            super().do_GET()

if __name__ == '__main__':
    PORT = 8080
    
    # Change to the dist directory
    os.chdir('dist')
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"🚀 SPA server running at http://localhost:{PORT}")
        print("📁 Serving from docs/dist directory")
        print("🔄 SPA routing enabled - all routes serve index.html")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
