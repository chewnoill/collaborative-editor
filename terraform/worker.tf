resource "google_compute_instance" "worker" {
  project = var.project_name
  name         = "app"
  machine_type = "e3-micro"
  zone = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.default.name
    network_ip = google_compute_address.worker-address.address
  }

  metadata_startup_script = <<-EOF
    mkdir /workspace
    cd /workspace
    gsutil cp -r gs://${google_storage_bucket.private_bucket.name}/service download
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    apt-get install -y nodejs postgresql
    tar xvf download/service.tgz
    export DATABASE_URL=$(gcloud secrets versions access latest --secret="database-url")
    export REDIS_URL=${var.redis_url}

    echo "starting application..."
    cd packages/service

    sudo -E node dist/mq.js
  EOF

  service_account {
    email  = google_service_account.app-user.email
    scopes = ["cloud-platform"]
  }
}
