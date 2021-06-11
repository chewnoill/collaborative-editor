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
    yText.insert(0,"Hello World");
    console.log({text: yText.toJSON()});
    const yUndoManager = new Y.UndoManager(yText);

    const editor = CodeMirror(ref.current, {
      mode: "markdown",
      lineNumbers: true,
    });

    const binding = new CodemirrorBinding(yText, editor, provider.awareness, {
      yUndoManager,
    });
    setTimeout(()=>{
    console.log({
      text:binding.doc.getText("codemirror").toJSON()})


    },2000)
  }, [ref]);
  return <div ref={ref} />;
}
