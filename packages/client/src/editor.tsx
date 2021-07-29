import React from "react";
import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import { WebrtcProvider } from "y-webrtc";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/lib/codemirror.css";
import { WebsocketProvider } from "y-websocket";
import { useSelector } from "react-redux";
import { selectDocument } from "./redux/appState/document";

const SIGNALLING_SERVICE =
  process.env.STORYBOOK_SIGNAL_URL || "ws://localhost:6006/ws/signal";
const PROVIDER_SERVICE =
  process.env.STORYBOOK_PROVIDER_URL || "ws://localhost:6006/ws/provider";

export default function Editor() {
  const doc = useSelector(selectDocument);
  if (!doc) {
    return <p>Select a document</p>;
  }
  return <TextCanvas document_id={doc.id} />;
}

function TextCanvas({ document_id }) {
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

    new CodemirrorBinding(yText, editor, provider.awareness, {
      yUndoManager,
    });
  }, [ref]);
  return <div ref={ref} />;
}
