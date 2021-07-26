
resource "google_compute_instance" "gateway" {
  project = var.project_name
  name         = "gateway"
  machine_type = "e2-micro"
  zone = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.default.name
    network_ip = google_compute_address.internal-gateway-address.address
    access_config {
      nat_ip = google_compute_address.gateway-address.address
      // Include this section to give the VM an external ip address
    }
  }

  metadata_startup_script = <<-EOF
    echo "*****    Installing Nginx    *****"
    apt update
    apt install -y nginx
    echo "*****    Configure Nginx    *****"
    echo '${data.template_file.nginx_config.rendered}' > /etc/nginx/conf.d/default.conf
    rm -rf /etc/nginx/sites-enabled
    
    echo "*****    Start Nginx    *****"
    systemctl enable nginx
    systemctl restart nginx
    echo "*****   Startup script completes!!    *****"
    EOF

  service_account {
    email  = google_service_account.default.email
    scopes = ["cloud-platform"]
  }
}

data "template_file" "nginx_config" {
  template = file("nginx/default.conf.template")
  vars = {
    PORT = 80
    STATIC_URL = "http://storage.googleapis.com/${var.public_gcs_bucket_name}/client"
    WEBSOCKET_URL = "http://${google_compute_instance.app.network_interface.0.network_ip}:6001"
    API_URL = "http://${google_compute_instance.app.network_interface.0.network_ip}:6001"
  }
}