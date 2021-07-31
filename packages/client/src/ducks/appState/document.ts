import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDocument } from "../types";

interface DocumentState {
  doc?: UserDocument;
  userDocs?: UserDocument[];
}

const initialState: DocumentState = {};

export const docSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocument: (state, { payload }) => {
      state.doc = payload;
    },
    setDocuments: (state, { payload }) => {
      state.userDocs = payload;
    },
    addDocument: (state, { payload }) => {
      state.userDocs.push(payload);
    },
  },
});

export const { setDocument, setDocuments, addDocument } = docSlice.actions;

const selectDocumentSlice = (state: RootState) => state.document;

export const selectDocument = createSelector(selectDocumentSlice, (state) => {
  if (!state.doc) return null;
  else return state.doc;
});

export const selectUserDocuments = createSelector(
  selectDocumentSlice,
  (state) => state.userDocs
);

export default docSlice.reducer;
