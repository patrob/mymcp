#!/bin/sh

# Install curl if not present (required for health checks)
apk add --no-cache curl

# Function to check if SSL certificates exist and are valid
check_ssl_certs() {
    echo "🔍 Checking SSL certificates..."
    
    # Check if certificate files exist and are not empty
    if [ -f "/etc/letsencrypt/live/mymcp.online/fullchain.pem" ] && \
       [ -f "/etc/letsencrypt/live/mymcp.online/privkey.pem" ] && \
       [ -s "/etc/letsencrypt/live/mymcp.online/fullchain.pem" ] && \
       [ -s "/etc/letsencrypt/live/mymcp.online/privkey.pem" ]; then
        echo "✅ Valid SSL certificates found"
        return 0  # certificates exist and are valid
    else
        echo "❌ SSL certificates missing or empty"
        return 1  # certificates don't exist or are invalid
    fi
}

# Function to get current configuration mode
get_current_mode() {
    if [ -f "/tmp/nginx_mode" ]; then
        cat /tmp/nginx_mode
    else
        echo "http"
    fi
}

# Function to set configuration mode
set_current_mode() {
    echo "$1" > /tmp/nginx_mode
}

# Function to start nginx with specified configuration
start_nginx() {
    local config_file="$1"
    local mode="$2"
    
    echo "🚀 Starting nginx with $mode configuration: $config_file"
    
    # Kill existing nginx process if running
    if [ -n "$NGINX_PID" ] && kill -0 "$NGINX_PID" 2>/dev/null; then
        echo "🔄 Stopping existing nginx process..."
        kill "$NGINX_PID"
        wait "$NGINX_PID" 2>/dev/null || true
    fi
    
    # Start nginx with the specified configuration
    nginx -c "$config_file" -g "daemon off;" &
    NGINX_PID=$!
    set_current_mode "$mode"
    
    echo "✅ Nginx started in $mode mode (PID: $NGINX_PID)"
}

# Initial configuration selection
echo "🔧 Initializing nginx configuration..."
if check_ssl_certs; then
    start_nginx "/etc/nginx/nginx.conf" "https"
else
    start_nginx "/etc/nginx/nginx-http-only.conf" "http"
fi

# Monitor for certificate changes and switch configurations when needed
echo "👀 Starting certificate monitoring (checking every 60 seconds)..."
while true; do
    sleep 60  # Check every minute for faster SSL transition
    
    current_mode=$(get_current_mode)
    
    if check_ssl_certs; then
        # Certificates exist - should be in HTTPS mode
        if [ "$current_mode" != "https" ]; then
            echo "🔒 SSL certificates detected! Switching to HTTPS mode..."
            start_nginx "/etc/nginx/nginx.conf" "https"
        fi
    else
        # No certificates - should be in HTTP-only mode
        if [ "$current_mode" != "http" ]; then
            echo "🔓 SSL certificates missing. Switching to HTTP-only mode..."
            start_nginx "/etc/nginx/nginx-http-only.conf" "http"
        fi
    fi
    
    # Check if nginx process is still running
    if [ -n "$NGINX_PID" ] && ! kill -0 "$NGINX_PID" 2>/dev/null; then
        echo "⚠️  Nginx process died. Restarting..."
        if check_ssl_certs; then
            start_nginx "/etc/nginx/nginx.conf" "https"
        else
            start_nginx "/etc/nginx/nginx-http-only.conf" "http"
        fi
    fi
done