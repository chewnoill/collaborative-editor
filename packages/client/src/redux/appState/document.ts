import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDocument } from "../types";

interface DocumentState {
  doc?: UserDocument;
  userDocs?: { [docId: string]: UserDocument };
}

const initialState: DocumentState = {};

export const docSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocument: (state, { payload }) => {
      state.doc = { id: payload.id, creator_id: payload.creator_id };
    },
    setDocuments: (state, { payload }) => {
      const docs = {};
      payload.map((doc) => (docs[doc.id] = doc));
      state.userDocs = docs;
    },
    addDocument: (state, { payload }) => {
      state.userDocs[payload.id] = payload;
    },
  },
});

export const { setDocument, setDocuments, addDocument } = docSlice.actions;

const selectDocumentSlice = (state: RootState) => state.document;

export const selectDocument = createSelector(selectDocumentSlice, (state) => {
  if (!state.doc) return null;
  else return state.userDocs[state.doc.id];
});

export const selectUserDocuments = createSelector(
  selectDocumentSlice,
  (state) => state.userDocs
);

export default docSlice.reducer;
