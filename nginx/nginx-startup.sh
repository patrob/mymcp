#!/bin/sh

# Install curl if not present (required for health checks)
apk add --no-cache curl

# Function to check if SSL certificates exist
check_ssl_certs() {
    if [ -f "/etc/letsencrypt/live/mymcp.online/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/mymcp.online/privkey.pem" ]; then
        return 0  # certificates exist
    else
        return 1  # certificates don't exist
    fi
}

# Function to switch nginx configuration
switch_nginx_config() {
    if check_ssl_certs; then
        echo "SSL certificates found. Using HTTPS configuration."
        cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.active
    else
        echo "SSL certificates not found. Using HTTP-only configuration."
        cp /etc/nginx/nginx-http-only.conf /etc/nginx/nginx.conf.active
    fi
}

# Initial configuration switch
switch_nginx_config

# Start nginx with the active configuration
nginx -c /etc/nginx/nginx.conf.active -g "daemon off;" &
NGINX_PID=$!

# Monitor for certificate changes and reload nginx when certificates become available
while true; do
    sleep 300  # Check every 5 minutes
    
    # Check if we need to switch configurations
    if [ ! -f "/etc/letsencrypt/live/mymcp.online/fullchain.pem" ]; then
        # No certificates, ensure we're using HTTP-only config
        if ! grep -q "listen 443" /etc/nginx/nginx.conf.active 2>/dev/null; then
            continue  # Already using HTTP-only config
        else
            echo "Switching to HTTP-only configuration (certificates missing)"
            cp /etc/nginx/nginx-http-only.conf /etc/nginx/nginx.conf.active
            nginx -s reload
        fi
    else
        # Certificates exist, ensure we're using HTTPS config
        if grep -q "listen 443" /etc/nginx/nginx.conf.active 2>/dev/null; then
            continue  # Already using HTTPS config
        else
            echo "SSL certificates detected. Switching to HTTPS configuration."
            cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.active
            nginx -s reload
        fi
    fi
done