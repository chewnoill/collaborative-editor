---
title: Building A Collabrative Text Editor
---

# Untitled

Building A Collabrative Text Editor

---

# [CAP Theorem](https://en.wikipedia.org/wiki/CAP_theorem)

> <div style="text-align: left">
>
> It is impossible for a distributed 
> data store to simultaneously provide 
> more than two out of the following 
> three guarantees:
>
>
> * Consistency
> * Availability 
> * Partition Tolerance
> </div>

---

<div style="text-align: left">

# OT

Operational Transformation

</div>
  
---

```mermaid
sequenceDiagram
    Peer A->>+Central Authority: Send update A
    Peer B ->>+ Central Authority: Send Update B
    Central Authority-->>+Peer A: update A (txn 1)
    Central Authority-->>+Peer B: update A (txn 1)
    Central Authority-->>+Peer A: update B (txn 2)
    Central Authority-->>+Peer B: update B (txn 2)      
```  

Requires a central authority to order all of the transactions

---

# Transport Layer

websockets

---

> ... there's a hack that works simply and efficiently, 
> but completely falls apart when you add more 
> requirements. OT is such a hack.
>
> -- Marijn Haverbeke


[Collaborative Editing in CodeMirror](https://marijnhaverbeke.nl/blog/collaborative-editing-cm.html)

---

codemirror 6 has native support for OT

https://codemirror.net/6/examples/collab/

---

<strong style="font-size:60px">CRDTs</strong>

Conflict-free Replicated Data Types

* Completely Distributed Architecture
* Peers can talk directly to each other
* Much lower server load

---

Much higher storage costs then OT

---

Lots of interesting work is being done in this field:

---

## [Automerge](https://github.com/automerge/automerge)

barebones network agnostic CRDT

---

## [YJS](https://github.com/yjs/yjs)

CRDT backed text editor

---

## [Hyper Core](https://hypercore-protocol.org/)

CRDT based on the DAT protocol

---

# Transport Layer

WebRTC

---

WebRTC :yikes:

```mermaid
graph

A[Peer A]
B[Peer B]
C[Signaling Service]
D[Peer D]
E[Peer E]

A --> B
A --> D
A --> E

B --> A
B --> D
B --> E

D --> A
D --> B
D --> E

E --> A
E --> B
E --> D

C --> A
C --> B
C --> D
C --> E 

```  

---

## Demo

# [shorturl.at/puAIV](https://shorturl.at/puAIV)

https://chewnoill.github.io/collaborative-editor



---

<pre><code data-line-numbers="5|6|7|10-13|15-17|">
export default function Editor() {
  const ref = React.useRef();
  React.useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider("new-room", ydoc);
    const yText = ydoc.getText("codemirror");
    const yUndoManager = new Y.UndoManager(yText);
    
    const editor = CodeMirror(ref.current, {
      mode: "markdown",
      lineNumbers: true,
    });

    new CodemirrorBinding(yText, editor, provider.awareness, {
      yUndoManager,
    });
  }, [ref]);
  return &lt;div ref={ref} />;
}
</code></pre>