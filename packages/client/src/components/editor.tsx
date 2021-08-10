import React, { useState } from "react";
import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/lib/codemirror.css";
import { useSelector } from "react-redux";
import { selectDocument } from "ducks/appState/document";
import styled from "@emotion/styled";
import useYDoc from "hooks/use-y-doc";
import DrawingCanvas from "./drawing-canvas";
import { useCurrentUser } from "apollo/selectors";

const Header = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f7f4d4;
`;

const Doc = {
  text: TextCanvas,
  drawing: DrawingCanvas,
};

export default function Editor() {
  const user = useCurrentUser();
  const doc = useSelector(selectDocument);
  const [docType, setDocType] = useState("text");
  if (!user) {
    return <p style={{ textAlign: "center" }}>need to login...</p>;
  }
  if (!doc) {
    return (
      <p style={{ textAlign: "center" }}>Select a document to start editing</p>
    );
  }
  const Canvas = Doc[docType];
  return (
    <div>
      <Header>
        <button onClick={() => setDocType("text")}>Text</button>
        <button onClick={() => setDocType("drawing")}>Sketch</button>
      </Header>
      <Canvas document_id={doc.id} name={user.username} />
    </div>
  );
}

const TextBox = styled.div`
  .remote-caret {
    position: absolute;
    border-left: black;
    border-left-style: solid;
    border-left-width: 2px;
    height: 1em;
  }
  .remote-caret > div {
    position: relative;
    top: -1.05em;
    font-size: 13px;
    background-color: rgb(250, 129, 0);
    font-family: serif;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    user-select: none;
    color: white;
    padding-left: 2px;
    padding-right: 2px;
    z-index: 3;
  }
`;

function TextCanvas({ document_id, name }) {
  const ref = React.useRef();
  const { data, error, isLoading, isError } = useYDoc(document_id);

  if (isError) {
    console.error(error.message);
  }

  React.useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    data.wsProvider.on("status", (event) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });
    data.rtcProvider.awareness.setLocalStateField("user", {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      name,
    });
    const yText = data.ydoc.getText("codemirror");
    const yUndoManager = new Y.UndoManager(yText);

    const editor = CodeMirror(ref.current, {
      mode: "markdown",
      lineNumbers: true,
    });

    new CodemirrorBinding(yText, editor, data.rtcProvider.awareness, {
      yUndoManager,
    });
  }, [ref, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error connecting to collab service</div>;
  } else {
    return <TextBox ref={ref} />;
  }
}
