import React, { useState } from "react";
import * as Y from "yjs";
import { CodemirrorBinding } from "y-codemirror";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/lib/codemirror.css";
import styled from "@emotion/styled";
import useYDoc from "hooks/use-y-doc";
import { useCurrentUserQuery } from "apollo/selectors";

const Header = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f7f4d4;
`;

export default function Editor({ document_id }: { document_id: string }) {
  const { data } = useCurrentUserQuery();
  const name = data?.me?.name || data?.random?.name;
  if (!name) return null;

  return <TextCanvas document_id={document_id} name={name} />;
}

const TextBox = styled.div`
  height: 100%;
  width: 100%;
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
  .CodeMirror {
    height: 100%;
  }
`;

function TextCanvas({ document_id, name }) {
  const ref = React.useRef();
  const data = useYDoc(document_id);

  React.useEffect(() => {
    if (!data.ydoc) {
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
      height: "100%",
      width: "100%",
    });

    new CodemirrorBinding(yText, editor, data.rtcProvider.awareness, {
      yUndoManager,
    });
  }, [ref, data]);

  return <TextBox ref={ref} />;
}
