resource "random_uuid" "user_content" { }

resource "google_storage_bucket" "user_content" {
  name = "user-content-${random_uuid.user_content.id}"
  force_destroy = true
  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "PUT"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

output "user-content-bucket" {
  value = google_storage_bucket.user_content.name
}

resource "google_service_account" "user_content_storage" {
  account_id   = "user-content-account"
  display_name = "User Content Account"
  project = var.project_name
}

resource "google_storage_bucket_iam_member" "user_content_editor" {
  bucket = google_storage_bucket.user_content.name
  role = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.user_content_storage.email}"
}

resource "google_service_account_key" "service_key" {
  service_account_id = google_service_account.user_content_storage.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

output "user_content_upload_service_credentials" {
  value       = google_service_account_key.service_key.private_key
  description = "Service account credentials for accessing user-content GCS bucket"
  sensitive   = true
}


resource "google_secret_manager_secret" "user_content_upload_service_credentials" {
  secret_id = "user-content-upload-service-credentials"

  labels = {
    label = "user-content-upload"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "user_content_upload_service_credentials" {
  secret = google_secret_manager_secret.user_content_upload_service_credentials.id
  secret_data = google_service_account_key.service_key.private_key
}

resource "google_secret_manager_secret_iam_member" "app-member-upload-creds" {
  secret_id = google_secret_manager_secret.user_content_upload_service_credentials.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.app-user.email}"
}
