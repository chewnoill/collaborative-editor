---
title: Getting Started
slug: getting-started
---

# Getting started

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Prerequisites

| Dependency | Description                                           |
| ---------- | ----------------------------------------------------- |
| docker     | local development - hosting databases instances       |
| postgres   | running database clients locally                      |
| dbmate     | Running database migrations                           |
| terraform  | Validating and Provisioning production infrastructure |

<Tabs>
  <TabItem value="osx" label="osx" default>

```sh
brew install node docker postgres dbmate terraform
```

:::note

You may need to install terraform from source for an m1 macbook. See [stackoverflow](https://stackoverflow.com/a/66281883).

```sh
brew install --build-from-source terraform
```

:::

  </TabItem>
  <TabItem value="windows" label="windows">
  TODO
  </TabItem>
  <TabItem value="linux" label="linux">
  TODO
  </TabItem>
</Tabs>

### Docker setup

Docker is the easiest to get started.

start containers
```shell
docker-compose up
```

### Running Locally

Install project dependencies locally
```shell
yarn
```

Start database and redis services
```shell
docker-compose up db redis
```

Set project env variables
```shell
source .env.sample
```

build the client
```shell
yarn client build
```

start service
```shell
yarn service dev
```

## Running database migrations
Make sure your `DATABASE_URL` is set.

Running migrations
```shell
yarn migrations up
```
OR if you need to rollback
```shell
yarn migrations down
```

create new migrations with
```shell
yarn migrations new <name of migration>
```

Afterwards rebuild your ORM Schema
```shell
yarn service zapatos
```