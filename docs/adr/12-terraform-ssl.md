---
title: 12 - Terraform SSL Certificates
---

# Terraform SSL Certificates

## Status

Accepted

## Context

SSL certificates can be generated and authenticated automatically. Authenticating and encrypting/decrypting ssl traffic can also be offloaded from the application layer into purpose built load balancers.

## How does it work?

```ts

resource "acme_certificate" "certificate" {
  account_key_pem         = acme_registration.reg.account_key_pem
  certificate_request_pem = tls_cert_request.req.cert_request_pem

  dns_challenge {
    provider = "netlify"
  }
}
```

`acme_certificate`s are provisioned and authenticated with our DNS provider, in this case **netlify**. Netlify keys need to be added to the environment for this connection to work.

Keeping certificates in terraform allows us to easily rotate certificates whenever we need too.


```ts

resource "google_compute_global_forwarding_rule" "default" {
  name                  = "ssl-proxy-xlb-forwarding-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.gateway-address.id
}
```

