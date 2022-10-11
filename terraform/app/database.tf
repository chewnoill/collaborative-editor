resource "google_sql_database_instance" "master" {
  name             = "db-instance"
  database_version = "POSTGRES_13"
  region           = "us-east1"

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = false
      private_network = google_compute_network.default.self_link
    }
  }
}

resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

resource "google_sql_user" "database_user" {
  name     = "database_user"
  instance = google_sql_database_instance.master.name
  password = random_password.db_password.result
}

resource "google_secret_manager_secret" "database-url" {
  secret_id = "database-url"

  labels = {
    label = "database"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "database-url" {
  secret      = google_secret_manager_secret.database-url.id
  secret_data = "postgres://${google_sql_user.database_user.name}:${random_password.db_password.result}@${google_sql_database_instance.master.ip_address.0.ip_address}/postgres"
}

resource "google_secret_manager_secret" "private-database-url" {
  secret_id = "private-database-url"

  labels = {
    label = "database"
  }

  replication {
    user_managed {
      replicas {
        location = "us-east1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "private-database-url" {
  secret      = google_secret_manager_secret.private-database-url.id
  secret_data = "postgres://${google_sql_user.database_user.name}:${random_password.db_password.result}@${google_sql_database_instance.master.private_ip_address}/postgres"
}