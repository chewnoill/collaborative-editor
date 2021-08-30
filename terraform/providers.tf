terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.81.0"
    }
  }
  backend "gcs" {
    bucket  = "willdocs-1"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project = var.project_name
  zone = "us-east1-b"
}

