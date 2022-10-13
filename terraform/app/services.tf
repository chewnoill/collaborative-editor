resource "google_artifact_registry_repository" "repo" {
  location      = "us-east1"
  repository_id = "docker-repo"
  description   = "docker repository"
  format        = "DOCKER"
}

resource "google_vpc_access_connector" "connector" {
  name          = "vpcconnector"
  max_throughput= 300
  ip_cidr_range = "10.0.1.0/28"

  network    = google_compute_network.default.name
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

module "cloud_run_service" {
  source = "./service"
  image = "us-east1-docker.pkg.dev/willdocs-1/docker-repo/service:latest"
  vpc_id = google_vpc_access_connector.connector.self_link
  name = "willdocs"
  email= google_service_account.app-user.email
  policy = data.google_iam_policy.noauth.policy_data
}


