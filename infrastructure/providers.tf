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

# Create SSH key for server access
resource "digitalocean_ssh_key" "main" {
  name       = "${var.project_name}-${var.environment}-key"
  public_key = var.ssh_public_key
}