#!/bin/bash
set -euo pipefail

# Deployment script for MyMCP application
# Usage: ./scripts/deploy.sh [DROPLET_IP]

DROPLET_IP=${1:-""}
APP_DIR="/opt/mymcp"
COMPOSE_FILE="docker-compose.production.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if droplet IP is provided
if [ -z "$DROPLET_IP" ]; then
    error "Please provide the droplet IP address as the first argument"
fi

# Check if required environment variables are set
if [ ! -f ".env" ]; then
    error ".env file not found. Please create it with required variables."
fi

log "Starting deployment to $DROPLET_IP..."

# Test SSH connection
log "Testing SSH connection..."
if ! ssh -o ConnectTimeout=10 mymcp@$DROPLET_IP "echo 'SSH connection successful'"; then
    error "Failed to connect to $DROPLET_IP via SSH"
fi

# Copy files to server
log "Copying application files to server..."
ssh mymcp@$DROPLET_IP "mkdir -p $APP_DIR"
rsync -az --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='bin' \
    --exclude='obj' \
    --exclude='*.log' \
    . mymcp@$DROPLET_IP:$APP_DIR/

# Copy environment file
log "Copying environment configuration..."
scp .env mymcp@$DROPLET_IP:$APP_DIR/.env

# Deploy application
log "Deploying application on server..."
ssh mymcp@$DROPLET_IP << EOF
    set -euo pipefail
    cd $APP_DIR
    
    echo "Stopping existing containers..."
    docker-compose -f $COMPOSE_FILE down || true
    
    echo "Cleaning up old images..."
    docker image prune -f
    docker volume prune -f
    
    echo "Building and starting application..."
    docker-compose -f $COMPOSE_FILE up -d --build
    
    echo "Waiting for services to start..."
    sleep 30
    
    echo "Checking service status..."
    docker-compose -f $COMPOSE_FILE ps
EOF

# Health check
log "Performing health check..."
for i in {1..10}; do
    if curl -f --max-time 10 http://$DROPLET_IP/health > /dev/null 2>&1; then
        log "✅ Application is healthy!"
        break
    else
        warn "Waiting for application to be ready... (attempt $i/10)"
        sleep 30
    fi
    if [ $i -eq 10 ]; then
        error "❌ Health check failed after 10 attempts"
    fi
done

log "🚀 Deployment completed successfully!"
log "Application URL: http://$DROPLET_IP"
log "Health Check: http://$DROPLET_IP/health"
log "SSH Access: ssh mymcp@$DROPLET_IP"