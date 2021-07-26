resource "google_compute_instance" "app" {
  project = var.project_name
  name         = "app"
  machine_type = "e2-micro"
  zone = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.default.name
    network_ip = google_compute_address.app-address.address
    access_config {
      // Include this section to give the VM an external ip address
    }
  }

  metadata_startup_script = <<-EOF
    mkdir /workspace
    cd /workspace
    gsutil cp -r gs://${var.private_gcs_bucket_name}/service download
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    apt-get install -y nodejs postgresql
    tar xvf download/service.tgz
    export DATABASE_URL=$(gcloud secrets versions access latest --secret="database-url")

    echo "running migrations..."
    curl -fsSL -o dbmate.bin https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
    chmod +x ./dbmate.bin
    ./dbmate.bin  -d ./packages/service/db/migrations -s ./packages/service/db/schema.sql up

    echo "starting application..."
    node packages/service/dist/bundle.js 
  EOF

  service_account {
    # TODO: This account account needs cloud storage permissions
    # so that it can load the service bundle, I haven't figured 
    # out how that works yet, other then manually
    # required roles:
    #   * storage object viewer
    #   * secret manager accessor
    email  = google_service_account.default.email
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    scopes = ["cloud-platform"]
  }
}

resource "google_service_account" "default" {
  account_id   = "terraform-account"
  display_name = "Terraform Account"
  project = var.project_name
}
