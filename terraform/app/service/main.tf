
resource "google_cloud_run_service" "default" {
  name     = "${var.name}-${var.region}"
  location = var.region

  template {
    spec {
      service_account_name = var.email
      containers {
        image = var.image
        env {
          name = "DATABASE_URL"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "database-url"
            }
          }
        }
        env {
          name = "REDIS_URL"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "redis-url"
            }
          }
        }
        env {
          name  = "GCS_BUCKET_NAME"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "user-content-bucket-name"
            }
          }
        }
        env {
          name  = "GCS_PRIVATE_KEY"
          value_from {
            secret_key_ref {
              key  = "latest"
              name = "user-content-upload-service-credentials"
            }
          }
        }
      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/client-name"          = "cloud-console"
        "run.googleapis.com/vpc-access-connector" = var.vpc_id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
        # Limit scale up to prevent any cost blow outs!
        "autoscaling.knative.dev/maxScale" = "5"
      }
    }

  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

// Cloud Run Example
resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name                  = "${var.name}-cloudrun-neg"
  network_endpoint_type = "SERVERLESS"
  region                = "us-east1"
  cloud_run {
    service = google_cloud_run_service.default.name
  }
}

resource "google_compute_backend_service" "cloud_run_service" {
  name                            = "${var.name}-cloudrun-backend-service"
  enable_cdn                      = false

  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg.id
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  service  = google_cloud_run_service.default.name

  policy_data = var.policy
}

