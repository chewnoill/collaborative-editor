resource "google_compute_instance" "worker" {
  project = var.project_name
  name         = "worker"
  machine_type = "e2-micro"
  zone = "us-east1-b"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.default.name
    network_ip = google_compute_address.internal-worker-address.address
    access_config {
      nat_ip = google_compute_address.external-worker-address.address
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
    export REDIS_URL=${var.redis_url}
    curl -Ls https://download.newrelic.com/install/newrelic-cli/scripts/install.sh | bash
    sudo NEW_RELIC_API_KEY=${var.NEW_RELIC_API_KEY} NEW_RELIC_ACCOUNT_ID=${var.NEW_RELIC_ACCOUNT_ID} \
      /usr/local/bin/newrelic install -y
    export NEW_RELIC_HOME=$(pwd)
    export NEW_RELIC_APP_NAME=app
    export NEW_RELIC_LICENSE_KEY=881ba2daa0a207ab2038f6b717f7233b6fb6NRAL
    echo '
      - name: worker.log
        file: /workspace/packages/service/output.log' >> /etc/newrelic-infra/logging.d/logging.yml
    echo "starting application..."
    cd packages/service

    sudo -E node dist/mq.js
  EOF

  service_account {
    email  = google_service_account.app-user.email
    scopes = ["cloud-platform"]
  }
}

resource "google_compute_address" "internal-worker-address" {
  project = var.project_name
  subnetwork   = google_compute_subnetwork.default.id
  address_type = "INTERNAL"
  address      = "10.0.0.43"
  name = "internal-worker-address"
}

resource "google_compute_address" "external-worker-address" {
  project = var.project_name
  address_type = "EXTERNAL"
  name = "external-worker-address"
}
