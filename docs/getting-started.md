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

The docker compose file `dev.yml` defines several top level services.

* mq: A redis store, that we are using as a message queue.
* db: A postgres datastore that we are using as a database.
* worker: A worker thread to run background processes
* service: The main web service
* client: A development client instance
* bash: A container to run bash scripts

```bash
docker compose -f ./dev.yml up
```

Should bring up all of the services you need for local development.

## Running database migrations

Any pending migrations can be run manually
```bash
docker compose -f ./dev.yml run bash \
  yarn migrations up
```

Create new migrations with
```shell
docker compose -f ./dev.yml run bash \
  yarn migrations new <name of migration>
```

This should make changes to several files

* `packages/service/db/schema.sql`: This is a sql dump file from the development database. The contents here is informational, reflecting the current expected database schema.
* `packages/service/src/zapatos/schema.d.ts`: This is auto generated typescript type definitions introspected from the database schema.