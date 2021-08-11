import { useEffect, useReducer } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";

const SIGNALLING_SERVICE =
  process.env.NEXT_PUBLIC_SIGNAL_URL || "ws://localhost:3000/ws/signal";
const CENTRAL_AUTHORITY =
  process.env.NEXT_PUBLIC_PROVIDER_URL || "ws://localhost:3000/ws/provider";

const cleanupProvider = (provider) => {
  if (!!provider) {
    provider.destroy();
  }
};

const selectIsLoading = (state) => state.loading.status;

const selectIsError = (state) => state.error.status;

const reducer = (state, action) => {
  switch (action.type) {
    case "setSuccessState":
      return {
        data: action.payload,
        loading: { status: false },
        error: { status: false, message: null },
      };
    case "setErrorState":
      return {
        data: {
          ydoc: null,
          rtcProvider: null,
          wsProvider: null,
        },
        loading: { status: false },
        error: { status: true, message: action.payload },
      };
    default:
      return state;
  }
};

export default function useYDoc(id) {
  const [state, dispatch] = useReducer(reducer, {
    data: {
      ydoc: null,
      rtcProvider: null,
      wsProvider: null,
    },
    loading: { status: true },
    error: { status: false, message: null },
  });

  useEffect(() => {
    const newYState = {
      ydoc: null,
      rtcProvider: null,
      wsProvider: null,
    };
    newYState.ydoc = new Y.Doc();

    try {
      newYState.rtcProvider = new WebrtcProvider(id, newYState.ydoc, {
        signaling: [SIGNALLING_SERVICE],
      } as any);
    } catch (e) {
      dispatch({
        type: "setErrorState",
        payload: `Connection to signalling service failed: ${e.name}: ${e.message}`,
      });
      return;
    }
    try {
      newYState.wsProvider = new WebsocketProvider(
        CENTRAL_AUTHORITY,
        id,
        newYState.ydoc
      );
    } catch (e) {
      cleanupProvider(newYState.rtcProvider);
      dispatch({
        type: "setErrorState",
        payload: `Connection to central authority failed: ${e.name}: ${e.message}`,
      });
      return;
    }
    dispatch({ type: "setSuccessState", payload: newYState });

    return () => {
      cleanupProvider(newYState.rtcProvider);
      cleanupProvider(newYState.wsProvider);
    };
  }, []);

  return {
    ...state,
    isLoading: selectIsLoading(state),
    isError: selectIsError(state),
  };
}
