import { useEffect, useState } from "react";
import * as Y from "yjs";
import { useDocument } from "apollo/selectors";
import { gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  createDocument,
  selectYDocument,
  selectYDocumentAwareness,
} from "ducks/appState/y-doc";

export function useEditDocument() {
  const [mutate] = useMutation(gql`
    mutation editDocument($id: UUID!, $update: String!) {
      editDocument(id: $id, update: $update)
    }
  `);
  return mutate;
}

export function useYDocValue(id) {
  const ydoc = useSelector((store) => selectYDocument(store, { id }));
  const [val, setVal] = useState(ydoc && ydoc.getText("codemirror").toJSON());
  useEffect(() => {
    function eventHandler(_, __, doc) {
      setVal(doc.getText("codemirror").toJSON());
    }
    if (!ydoc) return;
    ydoc.on("update", eventHandler);
    return () => {
      ydoc.off("update", eventHandler);
    };
  }, [ydoc]);

  return val;
}

export default function useYDoc(id, username) {
  const dispatch = useDispatch();
  const ydoc = useSelector((store) => selectYDocument(store, { id }));
  const awareness = useSelector((store) =>
    selectYDocumentAwareness(store, { id })
  );
  const doc = useDocument(id);
  const updateDoc = useEditDocument();

  useEffect(() => {
    dispatch(createDocument({ id, username }));
  }, [id, username]);

  useEffect(() => {
    if (!ydoc || !doc?.origin) return;

    const update = Buffer.from(doc?.origin.slice(2), "hex");
    Y.applyUpdate(ydoc, update, "init");

    ydoc.on("update", (update, origin) => {
      // don't persist updates coming from the webrtc connector
      if (origin.constructor?.name === "Room") return;
      if (origin === "init") return;
      updateDoc({
        variables: {
          id,
          update: `\\x${Buffer.from(update).toString("hex")}`,
        },
      });
    });
  }, [ydoc, doc?.origin]);

  return { ydoc, awareness };
}
