#!/bin/bash
set -euo pipefail

# Health check script for MyMCP application
# Usage: ./scripts/health-check.sh [DROPLET_IP]

DROPLET_IP=${1:-""}
TIMEOUT=${2:-30}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
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

log "Starting health check for $DROPLET_IP..."

# Function to check HTTP endpoint
check_endpoint() {
    local url=$1
    local description=$2
    
    info "Checking $description..."
    if curl -f --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
        log "✅ $description is healthy"
        return 0
    else
        warn "❌ $description is not responding"
        return 1
    fi
}

# Function to check container status
check_containers() {
    info "Checking container status..."
    ssh mymcp@$DROPLET_IP << 'EOF'
        cd /opt/mymcp
        echo "Container status:"
        docker-compose -f docker-compose.production.yml ps
        echo ""
        echo "Container health:"
        docker-compose -f docker-compose.production.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
EOF
}

# Function to check logs
check_logs() {
    info "Checking recent logs for errors..."
    ssh mymcp@$DROPLET_IP << 'EOF'
        cd /opt/mymcp
        echo "Recent application logs (last 20 lines):"
        docker-compose -f docker-compose.production.yml logs --tail=20 app
        echo ""
        echo "Recent nginx logs (last 10 lines):"
        docker-compose -f docker-compose.production.yml logs --tail=10 nginx
EOF
}

# Function to check system resources
check_resources() {
    info "Checking system resources..."
    ssh mymcp@$DROPLET_IP << 'EOF'
        echo "Memory usage:"
        free -h
        echo ""
        echo "Disk usage:"
        df -h
        echo ""
        echo "Docker disk usage:"
        docker system df
EOF
}

# Main health check
HEALTH_SCORE=0
TOTAL_CHECKS=0

# Check application health endpoint
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_endpoint "http://$DROPLET_IP/health" "Application health endpoint"; then
    HEALTH_SCORE=$((HEALTH_SCORE + 1))
fi

# Check main application
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_endpoint "http://$DROPLET_IP/" "Main application"; then
    HEALTH_SCORE=$((HEALTH_SCORE + 1))
fi

# Check API endpoint
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if check_endpoint "http://$DROPLET_IP/api/v1/config" "API configuration endpoint"; then
    HEALTH_SCORE=$((HEALTH_SCORE + 1))
fi

# Check containers
check_containers

# Check logs for any errors
check_logs

# Check system resources
check_resources

# Summary
echo ""
log "Health Check Summary:"
log "Score: $HEALTH_SCORE/$TOTAL_CHECKS checks passed"

if [ $HEALTH_SCORE -eq $TOTAL_CHECKS ]; then
    log "🎉 All systems are healthy!"
    exit 0
elif [ $HEALTH_SCORE -gt 0 ]; then
    warn "⚠️  Some issues detected, but core functionality may still work"
    exit 1
else
    error "💥 Critical issues detected - application appears to be down"
fi