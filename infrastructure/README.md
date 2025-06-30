# Infrastructure

This directory contains Terraform configuration for Digital Ocean deployment.

## Required Secrets

- `DIGITALOCEAN_ACCESS_TOKEN` - Digital Ocean API token  
- `SSH_PUBLIC_KEY` - SSH public key for server access

## Usage

The infrastructure is managed through GitHub Actions workflows:

- **terraform-pr.yml** - Validates changes on pull requests
- **infrastructure-deploy.yml** - Deploys infrastructure on main branch  
- **deploy-app.yml** - Deploys application to the infrastructure