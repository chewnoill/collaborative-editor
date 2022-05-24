
# Collaborative Text Editor

[Repo](https://github.com/chewnoill/collaborative-editor)

## Project Structure

```
.
├-- docker-compose.yml: defines docker config for local development
├-- Dockerfile: defines the base image used in development
├-- docs: project documentation
├-- package.json: defines project setup/dependencies
├-- packages
|   ├-- client: node project that builds a web bundle
|   |   ├-- package.json: defines client specific setup/dependencies
|   |   └-- src: Client source code
|   └-- service: node project that builds an express service
|       ├-- package.json: defines how the service is setup
|       ├-- db
|       |   ├-- schema.sql: current database schema dump
|       |   └-- migrations: A ordered set of database migrations to run to produce the schema.sql
|       └-- src: Service source code
|           ├-- service.ts: main service entrypoint
|           └-- message-queue-worker.ts: main entrypoint for the background job
├-- terraform: provisioning infrastructure
└-- website: Base Docusaurus document site
```

## Prerequisites

install packages:

```shell
brew install node docker postgres dbmate terraform
```

:::note

You may need to install terraform from source for an m1 macbook. See [stackoverflow](https://stackoverflow.com/a/66281883).

```shell
brew install --build-from-source terraform
```

:::

## Getting started

### Install dependencies:

```shell
yarn
```

### Docker setup:

build
```shell
docker-compose build
```

start containers
```shell
docker-compose up
```

### Service-specific setup:

start service
```shell
yarn service dev
```

start storybook
```shell
yarn client dev
```

## Running database migrations
Make sure your `DATABASE_URL` is set.

create a new migration
```shell
yarn migrations new <name of migration>
```

Running migrations
```shell
yarn migrations up
```
OR
```shell
yarn migrations down
```

## Generating database ORM schema
```shell
yarn service zapatos
```

# Data model

```sql
CREATE TABLE user (
  id   uuid,
  name text
)
```

```sql
CREATE TABLE document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value text NOT NULL,
    web_rtc_key text NOT NULL,
    origin bytea NOT NULL,
    latest_update_time timestamp without time zone NOT NULL,
    creator_id uuid NOT NULL,
    is_public boolean DEFAULT true NOT NULL
);
```

```sql
CREATE TABLE user_document (
  document_id uuid,
  user_id     uuid
)
```

An update queue for documents. These changes are merged with a document's `origin` to produce the current state of any document.

```sql
CREATE TABLE document_updates_queue (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    document_update bytea NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
```

## Deployment

Deployment is a three phase process. First, building the static bundle that we can serve to clients.

`yarn client build`

Powered by nextjs, this creates the client javascript bundles for each page, and any statically generated html is generated here.

`yarn service build`

Uses webpack to build the typescript express application that will serve the static bundle and dynamic api from one place.

