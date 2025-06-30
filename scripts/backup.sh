#!/bin/bash
set -euo pipefail

# Backup script for MyMCP application
# Usage: ./scripts/backup.sh [DROPLET_IP] [BACKUP_DIR]

DROPLET_IP=${1:-""}
BACKUP_DIR=${2:-"./backups"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="mymcp_backup_$TIMESTAMP"

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

# Create backup directory
mkdir -p "$BACKUP_DIR"

log "Starting backup process for $DROPLET_IP..."

# Create database backup
log "Creating database backup..."
ssh mymcp@$DROPLET_IP << EOF
    cd /opt/mymcp
    
    # Create database dump
    docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U postgres onpardev_mymcp > /tmp/db_backup_$TIMESTAMP.sql
    
    # Compress the backup
    gzip /tmp/db_backup_$TIMESTAMP.sql
EOF

# Download database backup
log "Downloading database backup..."
scp mymcp@$DROPLET_IP:/tmp/db_backup_$TIMESTAMP.sql.gz "$BACKUP_DIR/"

# Create application files backup (optional)
info "Creating application configuration backup..."
ssh mymcp@$DROPLET_IP << EOF
    cd /opt/mymcp
    
    # Create tar of important configuration files
    tar -czf /tmp/config_backup_$TIMESTAMP.tar.gz \
        .env \
        docker-compose.production.yml \
        nginx/nginx.conf \
        || true
EOF

# Download configuration backup
log "Downloading configuration backup..."
scp mymcp@$DROPLET_IP:/tmp/config_backup_$TIMESTAMP.tar.gz "$BACKUP_DIR/" || warn "Configuration backup failed"

# Clean up remote temporary files
log "Cleaning up temporary files on server..."
ssh mymcp@$DROPLET_IP << EOF
    rm -f /tmp/db_backup_$TIMESTAMP.sql.gz
    rm -f /tmp/config_backup_$TIMESTAMP.tar.gz
EOF

# Create backup info file
cat > "$BACKUP_DIR/backup_info_$TIMESTAMP.txt" << EOF
MyMCP Application Backup
========================
Backup Date: $(date)
Droplet IP: $DROPLET_IP
Backup Files:
- db_backup_$TIMESTAMP.sql.gz (PostgreSQL database dump)
- config_backup_$TIMESTAMP.tar.gz (Configuration files)

Restore Instructions:
1. Copy db_backup_$TIMESTAMP.sql.gz to the server
2. Run: gunzip db_backup_$TIMESTAMP.sql.gz
3. Run: docker-compose -f docker-compose.production.yml exec -T postgres psql -U postgres -d onpardev_mymcp < db_backup_$TIMESTAMP.sql
EOF

log "🎉 Backup completed successfully!"
log "Backup files saved to: $BACKUP_DIR"
log "Database backup: $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
log "Config backup: $BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"
log "Backup info: $BACKUP_DIR/backup_info_$TIMESTAMP.txt"