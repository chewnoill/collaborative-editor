
# Collaborative Text Editor

[Current build](https://chewnoill.github.io/collaborative-editor/)

[Slides](https://chewnoill.github.io/collaborative-editor/slides)

[Repo](https://github.com/chewnoill/collaborative-editor)

## Getting started

Install dependencies:
```shell
yarn
```

start service
```shell
yarn service
```

start storybook
```shell
yarn storybook
```

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
