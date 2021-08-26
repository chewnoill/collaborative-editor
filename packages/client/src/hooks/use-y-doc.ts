import { useEffect, useReducer, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";
import { CENTRAL_AUTHORITY, SIGNALING_SERVICE } from "env";

const cleanupProvider = (provider) => {
  if (!!provider) {
    provider.destroy();
  }
};

export default function useYDoc(id) {
  const [state, setState] = useState({ ydoc: null, rtcProvider: null, wsProvider: null });

  useEffect(() => {
    const ydoc = new Y.Doc();

    const rtcProvider = new WebrtcProvider(id, ydoc, {
      signaling: [SIGNALING_SERVICE],
    } as any);
    const wsProvider = new WebsocketProvider(
      CENTRAL_AUTHORITY,
      id,
      ydoc
    );
    setState({ ydoc, rtcProvider, wsProvider });

    return () => {
      cleanupProvider(rtcProvider);
      cleanupProvider(wsProvider);
    };
  }, []);

  return state
}
