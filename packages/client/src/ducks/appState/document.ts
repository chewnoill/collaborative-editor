import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDocument } from "../types";

interface DocumentState {
  doc?: UserDocument;
}

const initialState: DocumentState = {};

export const docSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocument: (state, { payload }) => {
      state.doc = payload;
    },
  },
});

export const { setDocument } = docSlice.actions;

const selectDocumentSlice = (state: RootState) => state.document;

export const selectDocument = createSelector(selectDocumentSlice, (state) => {
  if (!state.doc) return null;
  else return state.doc;
});

export default docSlice.reducer;
