---
slug: 04-infrastructure
title: 4 - Infrastructure
---
# Creating and Managing Infrastructure

## Status

Accepted

## Context

Production infrastructure needs to be created and managed. The initial application structure will look like this:

```
┌───────────────────┐   ┌────────────────────────────────────────────────┐
│      Github       │   │                   Terraform                    │
│                   │   │┌──────────────────────┐                        │
│                   │   ││     GCP Storage      │                        │
│┌─────────────────┐│   ││                      │                        │
││                 ││   ││                      │                        │
││   Actions CI    │├───┼┼─build─────┐          │                        │
││                 ││   ││           ▼          │                        │
│└─────────────────┘│   ││   ┌──────────────┐   │                        │
│                   │   ││   │Service bundle│   │                        │
│                   │   ││   └──────────────┘   │                        │
│                   │   │└───────────┬──────────┘                        │
└───────────────────┘   │            │                                   │
                        │┌───────────┼──────────────────────────────────┐│
                        ││           │     Sub-Network                  ││
                        ││           │                                  ││
                        ││           │                                  ││
                        ││           ▼                                  ││
                        ││┌─────────────────────┐                       ││
                        │││         App         │                       ││
                        │││                     │     ┌────────────────┐││
                        │││                     │────▶│  Postgres DB   │││
                        │││                     │     └────────────────┘││
                        │└┼─────────────────────┼───────────────────────┘│
                        │ │      Global IP      │                        │
                        │ └─────────────────────┘                        │
┌───────────────────┐   │            ▲                                   │
│                   │   │            │                                   │
│     DNS Entry     │───┼────────────┘                                   │
│                   │   │                                                │
└───────────────────┘   └────────────────────────────────────────────────┘
```

## Decision & Consequences

Infrastructure on [GCP](https://cloud.google.com/) will be provisioned and managed using [Terraform](https://www.terraform.io/). Terraform's own internal state is stored in a separate GCP bucket, which needs to be provisioned, along with access credentials to the GCP account. GCP was chosen because I wanted to try something that wasn't on AWS.

Github's Actions jobs runner will make production infrastructure deployments on commit to the master branch. See action for [production workflow](../../.github/workflows/production.yml)

This increases visibility of what the production infrastructure is, and makes it easier to track what changes need to be made.

See [/terraform](../../terraform/) for implementation details.
