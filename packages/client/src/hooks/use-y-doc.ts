import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";
import { CENTRAL_AUTHORITY, SIGNALING_SERVICE } from "env";
import { useDocument } from "apollo/selectors";

const cleanupProvider = (provider) => {
  if (!!provider) {
    provider.destroy();
  }
};

const yDocMap = {};

export function memoizeYDoc(id: string) {
  if (yDocMap[id]) return yDocMap[id];

  const ydoc = new Y.Doc();
  const rtcProvider = new WebrtcProvider(id, ydoc, {
    signaling: [SIGNALING_SERVICE],
  } as any);
  const wsProvider = new WebsocketProvider(CENTRAL_AUTHORITY, id, ydoc);

  yDocMap[id] = { ydoc, rtcProvider, wsProvider };
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

  useEffect(() => {
    if (!doc?.origin || !state.ydoc) return;
    const buf = Buffer.from(doc?.origin.slice(2), "hex");

    Y.applyUpdate(state.ydoc, buf);
  }, [doc?.origin, state.yDoc]);

  useEffect(() => {
    const { ydoc, rtcProvider, wsProvider } = state;

    return () => {
      cleanupProvider(rtcProvider);
      cleanupProvider(wsProvider);
    };
  }, []);

  return state;
}
