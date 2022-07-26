import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";
import { CENTRAL_AUTHORITY, SIGNALING_SERVICE } from "env";
import { useDocument } from "apollo/selectors";
import { gql, useMutation } from "@apollo/client";

const cleanupProvider = (provider) => {
  if (!!provider) {
    provider.destroy();
  }
};

export function useEditDocument() {
  const [mutate] = useMutation(gql`
    mutation editDocument($id: UUID!, $update: String!) {
      editDocument(id: $id, update: $update)
    }
  `);
  return mutate;
}
const yDocMap = {};

export function memoizeYDoc(id: string) {
  if (yDocMap[id]) return yDocMap[id];

  const ydoc = new Y.Doc();
  const rtcProvider = new WebrtcProvider(id, ydoc, {
    signaling: [SIGNALING_SERVICE],
  } as any);

  yDocMap[id] = { ydoc, rtcProvider };
  return yDocMap[id];
}

export function useYDocValue(id) {
  const [val, setVal] = useState("");
  const { ydoc } = useYDoc(id);
  useEffect(() => {
    function eventHandler(_, __, doc) {
      setVal(doc.getText("codemirror").toJSON());
    }
    if (!ydoc) return;
    ydoc.on("update", eventHandler);
    return () => {
      ydoc.off("update", eventHandler);
    };
  }, []);

  return val;
}

export default function useYDoc(id) {
  const state = useRef(memoizeYDoc(id)).current;
  const doc = useDocument(id);
  const updateDoc = useEditDocument();

  useEffect(() => {
    if (!doc?.origin || !state.ydoc) return;
    const buf = Buffer.from(doc?.origin.slice(2), "hex");
    Y.applyUpdate(state.ydoc, buf, "init");

    state.ydoc.on("update", (update, origin) => {
      console.log(`updating!! ${JSON.stringify(origin, null, 2)}`);
      if (origin === "init") return;
      updateDoc({
        variables: {
          id,
          update: `\\x${Buffer.from(update).toString("hex")}`,
        },
      });
      Y.logUpdate(update);
    });
  }, [doc?.origin, state.ydoc]);

  useEffect(() => {
    const { ydoc, rtcProvider, wsProvider } = state;

    return () => {
      cleanupProvider(rtcProvider);
      cleanupProvider(wsProvider);
    };
  }, []);

  return state;
}
