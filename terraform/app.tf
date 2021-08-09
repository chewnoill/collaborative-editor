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
    gsutil cp -r gs://${google_storage_bucket.private_bucket.name}/service download
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
    email  = google_service_account.app-user.email
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    scopes = ["cloud-platform"]
  }
}

resource "google_service_account" "app-user" {
  account_id   = "app-account"
  display_name = "App Account"
  project = var.project_name
}

resource "google_service_account_iam_binding" "app-user-iam" {
  service_account_id = google_service_account.app-user.name
  role               = "projects/${var.project_name}/roles/${google_project_iam_custom_role.app-user-role.role_id}"
  members = [ "serviceAccount:${google_service_account.app-user.email}" ]
}

resource "google_project_iam_custom_role" "app-user-role" {
  role_id     = "appUserRole"
  title       = "Role for the app user"
  permissions = ["secretmanager.versions.access"]
}