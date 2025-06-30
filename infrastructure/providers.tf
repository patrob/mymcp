terraform {
  required_version = ">= 1.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }

  # Simple state management - can upgrade to remote backend later
  # For production, consider using Digital Ocean Spaces or Terraform Cloud
}

provider "digitalocean" {
  token = var.digitalocean_token
}

# Find existing SSH key by public key content
data "digitalocean_ssh_keys" "main" {
  filter {
    key    = "public_key"
    values = [var.ssh_public_key]
  }
}

# Validate that SSH key exists and get its ID
locals {
  ssh_key_id = length(data.digitalocean_ssh_keys.main.ssh_keys) > 0 ? data.digitalocean_ssh_keys.main.ssh_keys[0].id : null
}

# Add validation to ensure SSH key exists
resource "null_resource" "validate_ssh_key" {
  count = local.ssh_key_id == null ? 1 : 0
  
  provisioner "local-exec" {
    command = "echo 'ERROR: SSH key not found in DigitalOcean account. Please upload the SSH public key to your DigitalOcean account first.' && exit 1"
  }
}