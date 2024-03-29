
resource "random_uuid" "private_bucket" {}

resource "google_storage_bucket" "private_bucket" {
  location                    = "us"
  name                        = "private-bucket-${random_uuid.private_bucket.id}"
  force_destroy               = true
  uniform_bucket_level_access = true
}

output "private-bucket" {
  value = google_storage_bucket.private_bucket.name
}
