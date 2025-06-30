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

output "domain_name" {
  description = "Domain name configured in Digital Ocean"
  value       = digitalocean_domain.mymcp_domain.name
}

output "nameservers" {
  description = "Digital Ocean nameservers for domain delegation"
  value = [
    "ns1.digitalocean.com",
    "ns2.digitalocean.com", 
    "ns3.digitalocean.com"
  ]
}

output "domain_setup_instructions" {
  description = "Instructions for setting up domain at registrar"
  value = <<-EOT
    To complete domain setup:
    1. Login to Namecheap
    2. Go to Domain List → Manage → Nameservers
    3. Set to "Custom DNS" and enter these nameservers:
       ns1.digitalocean.com
       ns2.digitalocean.com
       ns3.digitalocean.com
    4. Wait 30min-48hrs for DNS propagation
    5. Test: dig mymcp.online (should return ${digitalocean_reserved_ip.app_ip.ip_address})
  EOT
}