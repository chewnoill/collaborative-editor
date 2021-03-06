---
slug: 04-infrastructure
title: 4 - Infrastructure
---
# Creating and Managing Infrastructure

## Status

Accepted

## Context

Production infrastructure needs to be created and managed. The initial application structure will look like this:

<style>{`
.language-md-diagram {
  font-size: 10px;
  line-height: 12px;
}
`}</style>

```md-diagram
┌───────────────────┐   ┌────────────────────────────────────────────────┐
│      Github       │   │                   Terraform                    │
│                   │   │┌──────────────────────┐                        │
│                   │   ││     GCP Storage      │                        │
│┌─ merge master ──┐│   ││                      │                        │
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

### Storing Secrets

Terraform state might not be the best place to store secrets, although terraform does provide some means of easily rotating credentinals.

import prodBuild from '!!raw-loader!../../.github/workflows/production.yml';
import CodeBlock from '@theme/CodeBlock';

:::tip

Developers will need to aquire credentials inoder to access and update production configurations directly.


Production credentials are used by CI to deployments are forced on merge to master.
**.github/workflows/production.yml**: lines 68
<CodeBlock language="yml">{prodBuild.split('\n').slice(68).join('\n')}</CodeBlock>


:::



