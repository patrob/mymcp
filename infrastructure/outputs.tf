output "droplet_ip" {
  description = "Public IP address of the droplet"
  value       = digitalocean_reserved_ip.app_ip.ip_address
}

output "droplet_id" {
  description = "ID of the created droplet"
  value       = digitalocean_droplet.app_server.id
}

output "droplet_name" {
  description = "Name of the created droplet"
  value       = digitalocean_droplet.app_server.name
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh ${var.project_name}@${digitalocean_reserved_ip.app_ip.ip_address}"
}