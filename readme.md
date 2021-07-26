
# Collaborative Text Editor

Using CRDTs to build a collaborative text editor, is mostly a solved problem. Turning it into a usable app is a matter of doing regular app work. Adding user accounts, adding authentication and authorization, storing user data. The new complicated bits, syncing a distributed data store over webrtc/websockets, is basically just plug and play.

[Storybook](http://bingobongo.ml)

[Slides](http://bingobongo.ml/slides/index.html)

[Repo](https://github.com/chewnoill/collaborative-editor)

## Project Structure

```
|-- package.json: defines project setup/dependencies
|-- docker-compose.yml: defines docker config for local development
|-- Dockerfile: defines the base image used in development
|-- terraform: provisioning infrastruction 
|-- packages
    |-- client: node project that builds a web bundle
    |   |-- package.json: defines client specific setup/dependencies
    |   |-- .storybook: storybook configuration
    |   |-- src: Client source code
    |-- service: node project that builds an express service
        |-- package.json: defines how the service is setup
        |-- db
        |   |-- schema.sql: current database schema dump
        |   |-- migratations: A ordered set of database migrations to run to produce the schema.sql 
        |-- src: Service source code
```

## Prerequisites

install packages:

```shell
brew install node docker postgres dbmate
```

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
yarn service
```

start storybook
```shell
yarn storybook
```

## Running database migrations using dbmate
Make sure your `DATABASE_URL` is set.

create a new migration
```shell
dbmate n <name of migration>
```

Running migrations
```shell
dbmate up
```

For more information see: https://github.com/amacneil/dbmate

## Proposed Schema

`Document`:
- `origin`: an encoded string representing the entire change history of a document (CRDT)
- `value`: The raw end state of origin, precaculated, rendered as a string

# Data model

```sql
CREATE TABLE user (
  id   uuid,
  name text
)
```

```sql
CREATE TABLE document (
  id      uuid,
  origin text,
  value text,
  web_rtc_key text
)
```

```sql
CREATE TABLE user_document (
  document_id uuid,
  user_id     uuid
)
```

## Deployment

Two resources are required.
- javascript bundle & html
    
    Should be accessable at some IP and allow anonymous access. Supports SSL.
- websocket service
    
    Online service thats available to accept websocket requests.

## Javascript bundle & HTML

The only concern of this project, immediatly, 
is the editor. As such, the product of this
repository should include a javascript 
components, suitable for using in a React 
frontend.

Storybook will render the outer UI on the
deployed version of the application.

## Websocket Service

A javascript bundle suitable for being
deployed to some cloud compute instance. 
This is a standalone service.

# Problems to be solved:

* How do we secure WebRTC?
  * Security model that supports direct peer communication
  * Prevent bad actors from connecting to a data stream.
  * Allow bad actors to be removed from a data stream, 
once they have gained access.

* Data storage model
  * How do prevent unauthorized users from seeing data they aren't allowed to see?
  * How do we store data in a distributed system?
  * How do we propogate data to each peer?
  * How do we persist document changes?
