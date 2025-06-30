variable "digitalocean_token" {
  description = "Digital Ocean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key in Digital Ocean"
  type        = string
  default     = "main"
}

variable "region" {
  description = "Digital Ocean region"
  type        = string
  default     = "nyc1"
}

variable "droplet_size" {
  description = "Size of the droplet"
  type        = string
  default     = "s-1vcpu-1gb"  # $6/month droplet
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "mymcp"
}

variable "environment" {
  description = "Environment (staging, production)"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}