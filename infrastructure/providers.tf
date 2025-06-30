terraform {
  required_version = ">= 1.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  # Remote state backend using DigitalOcean Spaces
  backend "s3" {
    endpoint                    = "https://sfo3.digitaloceanspaces.com"
    bucket                      = "mymcp-terraform-state"
    key                         = "production/terraform.tfstate"
    region                     = "us-east-1" # Required but not used by DO Spaces
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    force_path_style           = true
  }
}

provider "digitalocean" {
  token = var.digitalocean_token
}

# Create SSH key for server access
resource "digitalocean_ssh_key" "main" {
  name       = "${var.project_name}-${var.environment}-key"
  public_key = var.ssh_public_key
}