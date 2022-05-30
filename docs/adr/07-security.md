---
slug: 07-security
title: 7 - Adding Security Policy
---

# Adding a Security Policy

## Status
In Progress

## Context

Document Updates are processed from a websocket endpoint `/ws/provider/{document_id}`. Requests that connect to the websocket endpoint can be authenticated from our current database, using existing authentication schemas.

:::warning

It is more unclear if an updates that come from connections actually originated from that connection. If an update originated from somewhere  else, how can it be authenticated, retroactively?

:::

## Decision & Consequences

* Users should only be allowed to connect to websocket documents that they have access too.

* The owner of each transactions will be recorded as the owner of the websocket connection, if it exists.

This way, the entire document history, and therefor its contents, can be authenticated, changes made by any user can be isolated or removed.

:::note

public documents will still be accessible to all connections.

:::
