
resource "google_compute_network" "default" {
  name                    = "terraform-network"
  auto_create_subnetworks = "true"
}

resource "google_compute_subnetwork" "default" {
  name          = "subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = "us-east1"
  network       = google_compute_network.default.id
}

resource "google_compute_firewall" "allow-ingress" {
  name      = "allow-ingress"
  network   = google_compute_network.default.name
  direction = "INGRESS"
  allow {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_global_address" "gateway-address" {
  project = var.project_name
  name    = "gateway-address"
}

output "gateway-ip" {
  value = google_compute_global_address.gateway-address.address
}
