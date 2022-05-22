---
slug: 06-worker-threads
title: 6 - Worker Threads
---

# Worker Threads and Background jobs

## Status
Accepted

## Context

Provides ability to schedule periodic tasks to run on intervals. Allowing big computations to be moved off of the request thread.

## Decision & Consequences

* [bullmq](https://github.com/taskforcesh/bullmq) - new node dependency

Running on a new CPU which needs to be provisioned on GCP. Also requires a redis instance to be provisioned (manually).
