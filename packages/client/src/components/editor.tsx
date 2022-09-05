import React, { useState } from "react";
import * as Y from "yjs";
import { EditorView, basicSetup } from "codemirror";
import { EditorSelection, EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { yCollab } from "y-codemirror.next";

import styled from "@emotion/styled";
import useYDoc from "hooks/use-y-doc";
import { useCurrentUserQuery } from "apollo/selectors";
import { useFileUpload } from "hooks/use-file-upload";

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
    min-height: 100%;
  }
  .cm-editor.cm-focused {
    outline: none;
  }
`;

function TextCanvas({ document_id, name }) {
  const uploadFile = useFileUpload();
  const ref = React.useRef();
  const data = useYDoc(document_id, name);

  React.useEffect(() => {
    if (!data.ydoc || !data.awareness) return;

    const yText = data.ydoc.getText("codemirror");
    const yUndoManager = new Y.UndoManager(yText);

    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        markdown({ codeLanguages: languages }),
        yCollab(yText, data.awareness, {
          undoManager: yUndoManager,
        }),
        EditorView.domEventHandlers({
          drop(event, view) {
            const pos = view.posAtCoords({ x: event.pageX, y: event.pageY });

            const files = event.dataTransfer.files;
            if (files.length === 0) return false;
            (async () => {
              const uploads = await Promise.all(
                Array.from(files).map(uploadFile)
              );

              uploads.forEach(({ id, name, mime_type }) =>
                yText.insert(
                  pos,
                  `<Img id="${id}"\n     mime_type="${mime_type}"\n     name="${name}"/>\n`
                )
              );
            })();
            return true;
          },
        }),
      ],
    });
    const editor = new EditorView({
      state,
      parent: ref.current,
    });
    return () => {
      editor.destroy();
    };
  }, [ref, data.awareness]);

  return <TextBox ref={ref} />;
}
