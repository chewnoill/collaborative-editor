
variable "dns_name" {
  type = string
  description = "dns name"
}

resource "tls_private_key" "private_key" {
  algorithm = "RSA"
}

resource "acme_registration" "reg" {
  account_key_pem = "${tls_private_key.private_key.private_key_pem}"
  email_address   = "nobody@${var.dns_name}"
}

resource "acme_certificate" "certificate" {
  account_key_pem           = "${acme_registration.reg.account_key_pem}"
  common_name               = var.dns_name

  dns_challenge {
    provider = "netlify"
  }
}

# Store Certificate in google secret manager

resource "google_secret_manager_secret" "ssl-cert" {
  secret_id = "ssl-cert"

  labels = {
    label = "ssl"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "ssl-cert" {
  secret = google_secret_manager_secret.ssl-cert.id
  secret_data = acme_certificate.certificate.certificate_pem
}

resource "google_secret_manager_secret_iam_member" "app-member-ssl-cert" {
  secret_id = google_secret_manager_secret.ssl-cert.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.app-user.email}"
}


resource "google_secret_manager_secret" "ssl-pk" {
  secret_id = "ssl-pk"

  labels = {
    label = "ssl"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "ssl-private-key" {
  secret = google_secret_manager_secret.ssl-pk.id
  secret_data = acme_certificate.certificate.private_key_pem
}

resource "google_secret_manager_secret_iam_member" "app-member-ssl-pk" {
  secret_id = google_secret_manager_secret.ssl-pk.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.app-user.email}"
}
