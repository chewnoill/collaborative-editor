resource "google_compute_instance" "app" {
  project = var.project_name
  name         = "app"
  machine_type = "e2-micro"
  zone = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.default.name
    network_ip = google_compute_address.app-address.address
    access_config {
      nat_ip = google_compute_address.gateway-address.address
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
    gcloud secrets versions access latest --secret="user-content-upload-service-credentials" | base64 -d > gcs_user_content.json
    export GCS_BUCKET_NAME=${google_storage_bucket.user_content.name}
    export GCS_CREDS_FILE=$(pwd)/gcs_user_content.json
    export PORT=443
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
      - name: service.log
        file: /workspace/packages/service/output.log' >> /etc/newrelic-infra/logging.d/logging.yml

    echo $(gcloud secrets versions access latest --secret="ssl-pk") > server-key.pem
    echo $(gcloud secrets versions access latest --secret="ssl-cert") > server-cert.pem
    export SSL_SERVER_KEY=/workspace/server-key.pem
    export SSL_SERVER_CERT=/workspace/server-cert.pem

    echo "starting application..."
    # TODO: remove this
    # run bundle as root so we can use port 443
    sudo -E pm2 start dist/bundle.js --no-daemon -i max
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

resource "google_secret_manager_secret_iam_member" "app-member" {
  secret_id = google_secret_manager_secret.database-url.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.app-user.email}"
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.private_bucket.name
  role = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.app-user.email}"
}