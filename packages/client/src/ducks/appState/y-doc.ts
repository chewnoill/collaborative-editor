import { createSelector, createSlice } from "@reduxjs/toolkit";
import { SIGNALING_SERVICE } from "env";
import { WebrtcProvider } from "y-webrtc";
import { applyUpdate, Doc, YArrayEvent } from "yjs";
import type { RootState } from "../store";

interface YDocumentState {
  docMap: {
    [key: string]: boolean;
  };
}

const documentMap: {
  [key: string]:
    | {
        doc: Doc;
        webrtcProvider: WebrtcProvider;
      }
    | undefined;
} = {};

const initialState: YDocumentState = {
  docMap: {},
};

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

export const yDocSlice = createSlice({
  name: "y-doc",
  initialState,
  reducers: {
    createDocument: (
      state,
      {
        payload: { id, username },
      }: { payload: { id: string; username: string } }
    ) => {
      if (!id) return;
      if (documentMap[id]) return;
      const doc = new Doc();
      const webrtcProvider = new WebrtcProvider(id, doc, {
        signaling: [SIGNALING_SERVICE],
      } as any);
      webrtcProvider.awareness.setLocalStateField("user", {
        color: pickAColor(),
        name: username,
      });

      documentMap[id] = {
        doc,
        webrtcProvider,
      };
      state.docMap[id] = true;
    },
  },
});

export const { createDocument } = yDocSlice.actions;

const selectYDocumentSlice = (state: RootState) => state["y-doc"];

export const selectDocumentInfo = createSelector(
  selectYDocumentSlice,
  (_, { id }) => id,
  (state, id) => documentMap[id]
);

export const selectYDocument = createSelector(
  selectDocumentInfo,
  (state) => state?.doc
);

export const selectYDocumentAwareness = createSelector(
  selectDocumentInfo,
  (state) => state?.webrtcProvider.awareness
);

export default yDocSlice.reducer;
