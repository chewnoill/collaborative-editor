import React from "react";
import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import { WebrtcProvider } from "y-webrtc";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/lib/codemirror.css";

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
  return <div ref={ref} />;
}
