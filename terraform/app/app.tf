resource "google_compute_instance" "app" {
  project      = var.project_name
  name         = "app-${var.build_number}"
  machine_type = "e2-micro"
  zone         = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.default.name
    network_ip = google_compute_address.app-address.address

    access_config {}
  }

  metadata_startup_script = <<-EOF
    mkdir /workspace
    cd /workspace
    gsutil cp -r gs://${google_storage_bucket.private_bucket.name}/service download
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    apt-get install -y nodejs postgresql
    tar xvf download/service.tgz
    export DATABASE_URL=$(gcloud secrets versions access latest --secret="database-url")
    gcloud secrets versions access latest --secret="user-content-upload-service-credentials" | base64 -d > gcs_user_content.json
    export GCS_BUCKET_NAME=${google_storage_bucket.user_content.name}
    export GCS_CREDS_FILE=$(pwd)/gcs_user_content.json
    export PORT=8080
    export REDIS_URL=${var.redis_url}

    echo "running migrations..."
    curl -fsSL -o dbmate.bin https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
    chmod +x ./dbmate.bin
    ./dbmate.bin  -d ./packages/service/db/migrations -s ./packages/service/db/schema.sql up

    cd packages/service
    sudo npm add -g pm2
    curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash && sudo NEW_RELIC_API_KEY=${var.NEW_RELIC_API_KEY} NEW_RELIC_ACCOUNT_ID=${var.NEW_RELIC_ACCOUNT_ID} /usr/local/bin/newrelic install -y
    export NEW_RELIC_HOME=$(pwd)
    export NEW_RELIC_APP_NAME=app
    export NEW_RELIC_LICENSE_KEY=881ba2daa0a207ab2038f6b717f7233b6fb6NRAL
    echo '
    logs:
      - name: service.log
        file: /workspace/packages/service/output.log' > /etc/newrelic-infra/logging.d/logging.yml

    echo "starting application..."
    pm2 start dist/bundle.js --no-daemon -i 1
  EOF

  service_account {
    # TODO: This account account needs cloud storage permissions
    # so that it can load the service bundle, I haven't figured
    # out how that works yet, other then manually
    # required roles:
    #   * storage object viewer
    #   * secret manager accessor
    email = google_service_account.app-user.email
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    scopes = ["cloud-platform"]
  }
}

resource "google_compute_address" "app-address" {
  project      = var.project_name
  subnetwork   = google_compute_subnetwork.default.id
  address_type = "INTERNAL"
  name         = "app-instance-address-${var.build_number}"
}

resource "google_service_account" "app-user" {
  account_id   = "app-account"
  display_name = "App Account"
  project      = var.project_name
}

resource "google_secret_manager_secret_iam_member" "app-member" {
  secret_id = google_secret_manager_secret.database-url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app-user.email}"
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.private_bucket.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.app-user.email}"
}

resource "google_compute_instance_group" "app_group" {
  name      = "app-group-${var.build_number}"
  zone      = "us-east1-b"
  instances = [google_compute_instance.app.id]
  named_port {
    name = "http"
    port = "8080"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_compute_backend_service" "app_service" {
  name      = "http-app-service"
  port_name = "http"
  protocol  = "HTTP"

  backend {
    group = google_compute_instance_group.app_group.id
  }

  health_checks = [
    google_compute_health_check.http_app_health.id,
  ]
}

resource "google_compute_health_check" "http_app_health" {
  name = "http-app-health-check"
  http_health_check {
    port = "8080"
  }
}

resource "google_compute_url_map" "default" {
  name        = "default-url-map"
  description = "a description"

  default_service = google_compute_backend_service.app_service.id
}
