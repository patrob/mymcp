terraform {
  required_version = ">= 1.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  # Simple state management - can upgrade to remote backend later
  # For production, consider using Digital Ocean Spaces or Terraform Cloud
}

provider "digitalocean" {
  token = var.digitalocean_token
}

# Data source for SSH key
data "digitalocean_ssh_key" "main" {
  name = var.ssh_key_name
}