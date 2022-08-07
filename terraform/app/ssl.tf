
variable "dns_name" {
  type        = string
  description = "dns name"
}

resource "tls_private_key" "private_key" {
  algorithm = "RSA"
}


resource "acme_registration" "reg" {
  account_key_pem = tls_private_key.private_key.private_key_pem

  email_address = "nobody@${var.dns_name}"
}

resource "tls_private_key" "cert_private_key" {
  algorithm = "RSA"
}

resource "tls_cert_request" "req" {
  private_key_pem = tls_private_key.cert_private_key.private_key_pem
  dns_names       = [var.dns_name]

  subject {
    common_name = var.dns_name
  }
}


resource "acme_certificate" "certificate" {
  account_key_pem         = acme_registration.reg.account_key_pem
  certificate_request_pem = tls_cert_request.req.cert_request_pem

  dns_challenge {
    provider = "netlify"
    config = {
      NETLIFY_HTTP_TIMEOUT = 30
      NETLIFY_POLLING_INTERVAL = 30
      NETLIFY_PROPAGATION_TIMEOUT = 30
      NETLIFY_TTL = 30
    }
  }
}

resource "google_compute_ssl_certificate" "default" {
  name        = "main-certiticate"
  private_key = tls_private_key.cert_private_key.private_key_pem
  certificate = acme_certificate.certificate.certificate_pem
  lifecycle { create_before_destroy = true }
}

resource "google_compute_target_https_proxy" "default" {
  name             = "app-https-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_ssl_certificate.default.id]
}

# forwarding rule
resource "google_compute_global_forwarding_rule" "default" {
  name                  = "ssl-proxy-xlb-forwarding-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.gateway-address.id
}
