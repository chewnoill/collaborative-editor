import React, { useState } from "react";
import * as Y from "yjs";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { yCollab } from "y-codemirror.next";
import { materialDark as darkTheme } from "cm6-theme-material-dark";
import { basicLight as lightTheme } from "cm6-theme-basic-light";
import styled from "@emotion/styled";
import useYDoc from "hooks/use-y-doc";
import { useCurrentUserQuery } from "apollo/selectors";
import { useFileUpload } from "hooks/use-file-upload";
import { uploadFilesToYDoc } from "utils/upload-files";
import yDoc from "ducks/appState/y-doc";
import { useMediaQuery } from "@mui/material";

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
  .cm-editor {
  }
  .cm-editor.cm-focused {
    outline: none;
  }
`;

function TextCanvas({ document_id, name }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const uploadFile = useFileUpload();
  const ref = React.useRef();
  const data = useYDoc(document_id, name);

  const wrap = data.ydoc?.getMap("meta").get("wrap");
  React.useEffect(() => {
    if (!data.ydoc || !data.awareness) return;

    const yText = data.ydoc.getText("codemirror");
    const yUndoManager = new Y.UndoManager(yText);

    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        wrap === "soft-wrap" && EditorView.lineWrapping,
        markdown({ codeLanguages: languages }),
        yCollab(yText, data.awareness, {
          undoManager: yUndoManager,
        }),
        prefersDarkMode ? darkTheme : lightTheme,
        EditorView.domEventHandlers({
          drop(event, view) {
            const pos = view.posAtCoords({ x: event.pageX, y: event.pageY });

            const files = event.dataTransfer.files;
            if (files.length === 0) return false;
            uploadFilesToYDoc(data.ydoc, files, {
              insertPos: pos,
              uploadFn: uploadFile,
            });
            return true;
          },
        }),
      ].filter((e) => !!e),
    });
    const editor = new EditorView({
      state,
      parent: ref.current,
    });
    return () => {
      editor.destroy();
    };
  }, [ref, data.awareness, wrap]);

  return <TextBox ref={ref} />;
}
