# Choosing YJS

## Status
Accepted

## Context

The base requirement is to persist state across clients
in real time. Since we're targeting the browser, we only
looked at javascript libraries.
Several CRDTs implementations are available, YJS was chosen
because of how far it was built out.

* [Automerge](https://github.com/automerge/automerge)
bare-bones network agnostic CRDT
* [Hyper Core](https://hypercore-protocol.org/)
CRDT based on the DAT protocol
* [YJS](https://github.com/yjs/yjs)
CRDT backed text editor

## Decision

Use Yjs CRDTs, and associated providers. Lots of work
has been done here and we should use as much of it as
possible.

Yjs has been split into multiple distinct packages.
These are the ones we will target:

* [yjs](https://www.npmjs.com/package/yjs)
A CRDT framework with a powerful abstraction of shared data
* [y-protocols](https://www.npmjs.com/package/y-protocols)
Binary encoding protocols for syncing, awareness, and history inforamtion
* [y-codemirror](https://www.npmjs.com/package/y-codemirror)
CodeMirror Binding for Yjs - Demo
* [y-webrtc](https://www.npmjs.com/package/y-webrtc)
WebRTC connector for Yjs
* [y-websocket](https://www.npmjs.com/package/y-websocket)
WebSocket Provider for Yjs

## Consequences

We need to do some work familiarizing with how yjs works.
We get all CRDT transport layers basically for free.
This locks the project into the node ecosystem for both front and backends.
