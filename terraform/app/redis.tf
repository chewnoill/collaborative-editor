resource "google_secret_manager_secret" "redis-url" {
  secret_id = "redis-url"

  labels = {
    label = "redis"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "redis-url" {
  secret      = google_secret_manager_secret.redis-url.id
  secret_data = var.redis_url
}

resource "google_secret_manager_secret_iam_member" "app-redis-member" {
  secret_id = google_secret_manager_secret.redis-url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app-user.email}"
}