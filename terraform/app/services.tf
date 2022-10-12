resource "google_artifact_registry_repository" "repo" {
  location      = "us-east1"
  repository_id = "docker-repo"
  description   = "docker repository"
  format        = "DOCKER"
}

resource "google_cloud_run_service" "default" {
  name     = "willdocs-service"
  location = "us-east1"

  template {
    spec {
      service_account_name = google_service_account.app-user.email
      containers {
        image = "us-east1-docker.pkg.dev/willdocs-1/docker-repo/service:latest"
        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              key = "latest"
              name = "database-url"
            }
          }
        }
        env {
          name = "REDIS_URL"
          value_from {
            secret_key_ref {
              key = "latest"
              name = "redis-url"
            }
          }
        }
        command = ["./start-app.sh"]
      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/client-name"          = "cloud-console"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.self_link
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
        # Limit scale up to prevent any cost blow outs!
        "autoscaling.knative.dev/maxScale" = "5"
      }
    }
  }
}

resource "google_project_service" "vpcaccess_api" {
  service  = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

# VPC access connector
resource "google_vpc_access_connector" "connector" {
  name          = "vpcconnector"
  max_throughput= 300
  ip_cidr_range = "10.0.1.0/28"

  network       = google_compute_network.default.name
  depends_on    = [google_project_service.vpcaccess_api]
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

// Cloud Run Example
resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name                  = "cloudrun-neg"
  network_endpoint_type = "SERVERLESS"
  region                = "us-east1"
  cloud_run {
    service = google_cloud_run_service.default.name
  }
}

resource "google_compute_backend_service" "cloud_run_service" {
  name                            = "cloudrun-backend-service"
  enable_cdn                      = false

  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg.id
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.default.location
  project     = google_cloud_run_service.default.project
  service     = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}