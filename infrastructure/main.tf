# Cloud-init script to set up Docker and basic configuration
locals {
  cloud_init = base64encode(templatefile("${path.module}/cloud-init.yml", {
    project_name = var.project_name
  }))
}

# Create the droplet
resource "digitalocean_droplet" "app_server" {
  image      = "ubuntu-22-04-x64"
  name       = "${var.project_name}-${var.environment}"
  region     = var.region
  size       = var.droplet_size
  ssh_keys   = [data.digitalocean_ssh_key.main.id]
  user_data  = local.cloud_init
  
  # Enable monitoring and backups
  monitoring = true
  backups    = false  # Keep costs low - can enable later
  
  tags = [
    "project:${var.project_name}",
    "environment:${var.environment}",
    "managed-by:terraform"
  ]
}

# Create firewall for the droplet
resource "digitalocean_firewall" "app_firewall" {
  name = "${var.project_name}-${var.environment}-firewall"

  droplet_ids = [digitalocean_droplet.app_server.id]

  # SSH access
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTP traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS traffic
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow all outbound traffic
  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Reserved IP for the droplet (optional - keeps IP if droplet is recreated)
resource "digitalocean_reserved_ip" "app_ip" {
  region = var.region
}

# Assign the reserved IP to the droplet
resource "digitalocean_reserved_ip_assignment" "app_ip_assignment" {
  ip_address = digitalocean_reserved_ip.app_ip.ip_address
  droplet_id = digitalocean_droplet.app_server.id
}