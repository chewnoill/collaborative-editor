---
title: next-scaling-infrastructure
---

# Horizontal Scaling

nodejs is single threaded, so squeezing in horizontal scaling takes some work.

* [pm2](https://www.npmjs.com/package/pm2)

# Vertical Scaling

* load balancer - terraform proxy
* add a multiplier for CPUs

# Adding SSL

see provider https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_target_ssl_proxy

# Doing deployments