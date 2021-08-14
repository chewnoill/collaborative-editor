resource "google_storage_bucket" "static-site" {
  name          = var.dns_name
  force_destroy = true

  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["http://${var.dns_name}"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

resource "google_storage_bucket_iam_member" "public" {
  bucket = google_storage_bucket.static-site.name
  role = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "random_uuid" "private_bucket" { }

resource "google_storage_bucket" "private_bucket" {
  name = "private-bucket-${random_uuid.private_bucket.id}"
  force_destroy = true
  uniform_bucket_level_access = true
}

output "static-bucket" {
  value = google_storage_bucket.static-site.name
}
output "private-bucket" {
  value = google_storage_bucket.private_bucket.name
}
