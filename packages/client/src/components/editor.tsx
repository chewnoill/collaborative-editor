import React from "react";
import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import { WebrtcProvider } from "y-webrtc";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/lib/codemirror.css";
import { WebsocketProvider } from "y-websocket";
import { useSelector } from "react-redux";
import { selectDocument } from "ducks/appState/document";
import { selectUser } from "ducks/appState/user";

const SIGNALLING_SERVICE =
  process.env.NEXT_PUBLIC_SIGNAL_URL || "ws://localhost:6006/ws/signal";
const PROVIDER_SERVICE =
  process.env.NEXT_PUBLIC_PROVIDER_URL || "ws://localhost:6006/ws/provider";

export default function Editor() {
  const user = useSelector(selectUser);
  const doc = useSelector(selectDocument);
  if (!user) {
    return <p>need to login...</p>;
  }
  if (!doc) {
    return <p>Select a document to start editing</p>;
  }
  return <TextCanvas document_id={doc.id} name={user.username} />;
}

function TextCanvas({ document_id }) {

function TextCanvas({ document_id, name }) {
  const ref = React.useRef();

  React.useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(document_id, ydoc, {
      signaling: [SIGNALLING_SERVICE],
    } as any);
    const yText = ydoc.getText("codemirror");
    const yUndoManager = new Y.UndoManager(yText);

    const wsProvider = new WebsocketProvider(
      PROVIDER_SERVICE,
      document_id,
      ydoc
    );

    wsProvider.on("status", (event) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    const editor = CodeMirror(ref.current, {
      mode: "markdown",
      lineNumbers: true,
    });

    provider.awareness.setLocalStateField("user", {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      name,
    });
    new CodemirrorBinding(yText, editor, provider.awareness, { yUndoManager });

    return () => {
      provider.destroy();
      wsProvider.destroy();
    };
  }, [ref]);
  return <div ref={ref} />;
}
