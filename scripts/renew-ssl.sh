#!/bin/bash
# SSL Certificate Renewal Script for MyMCP

cd /opt/mymcp

echo "$(date): Starting SSL certificate renewal check..."

# Attempt to renew certificates
docker-compose -f docker-compose.production.yml run --rm certbot renew --quiet

# Check if certificates were renewed
if [ $? -eq 0 ]; then
    echo "$(date): Certificate renewal check completed successfully"
    
    # Reload nginx to use new certificates
    docker-compose -f docker-compose.production.yml exec nginx nginx -s reload
    echo "$(date): Nginx reloaded with updated certificates"
else
    echo "$(date): Certificate renewal failed"
    exit 1
fi