
resource "google_compute_network" "default" {
  name                    = "network"
  auto_create_subnetworks = "false"
}

resource "google_compute_subnetwork" "default" {
  name          = "subnetwork"
  ip_cidr_range = "10.0.0.0/24"
  region        = "us-east1"
  network       = google_compute_network.default.id
}
resource "google_compute_global_address" "gateway-address" {
  project = var.project_name
  name    = "gateway-address"
}

output "gateway-ip" {
  value = google_compute_global_address.gateway-address.address
}
