import React, { useState } from "react";
import * as Y from "yjs";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { yCollab } from "y-codemirror.next";

import styled from "@emotion/styled";
import useYDoc from "hooks/use-y-doc";
import { useCurrentUserQuery } from "apollo/selectors";

export default function Editor({ document_id }: { document_id: string }) {
  const { data } = useCurrentUserQuery();
  const name = data?.me?.name || data?.random?.name;
  if (!name) return null;

  return <TextCanvas document_id={document_id} name={name} />;
}

const TextBox = styled.div`
  height: 100%;
  width: calc(100% - 90px);
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

const usercolors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];

function pickAColor() {
  return usercolors[Math.floor(Math.random() * usercolors.length)];
}

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
      color: pickAColor(),
      name,
    });
    const yText = data.ydoc.getText("codemirror");
    const yUndoManager = new Y.UndoManager(yText);

    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        markdown(),
        yCollab(yText, data.rtcProvider.awareness, {
          undoManager: yUndoManager,
        }),
        EditorView.domEventHandlers({
          drop(event, view) {
            console.log("dropped", event, view);
          },
        }),
      ],
    });
    const editor = new EditorView({
      state,
      parent: ref.current,
    });
  }, [ref, data]);

  return <TextBox ref={ref} />;
}
