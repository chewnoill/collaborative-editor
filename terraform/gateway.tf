
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

    echo "*****    Configure SSL cert    *****"
    apt install -y snapd
    snap install core
    snap refresh core
    snap install --classic certbot
    ln -s /snap/bin/certbot /usr/bin/certbot
    certbot --standalone certonly -n --agree-tos \
      --email nobody@${var.dns_name} \
      --domains ${var.dns_name}
    certbot --nginx -n --agree-tos \
      --email nobody@${var.dns_name} \
      --domains ${var.dns_name}
    
    echo "*****    Start Nginx    *****"
    systemctl enable nginx
    systemctl restart nginx
    echo "*****   Startup script completes!!    *****"
    EOF

  service_account {
    email  = google_service_account.app-user.email
    scopes = ["cloud-platform"]
  }
}

data "template_file" "nginx_config" {
  template = file("nginx/default.conf.template")
  vars = {
    PORT = 80
    DNS_NAME = var.dns_name
    STATIC_URL = "http://storage.googleapis.com/${google_storage_bucket.static-site.name}"
    WEBSOCKET_URL = "http://${google_compute_instance.app.network_interface.0.network_ip}:6001"
    API_URL = "http://${google_compute_instance.app.network_interface.0.network_ip}:6001"
  }
}