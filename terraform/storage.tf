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

output "private-bucket" {
  value = google_storage_bucket.private_bucket.name
}
