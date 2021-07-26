terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.76.0"
    }
  }
  backend "gcs" {
    # var.public_gcs_bucket_name
    bucket  = "willdocs-1"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project = var.project_name
  zone = "us-east1-b"
}

