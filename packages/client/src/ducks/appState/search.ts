import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserDocument } from "../types";

interface SearchState {
  searchString?: string;
}

const initialState: SearchState = {};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchString: (state, { payload }) => {
      state.searchString = payload;
    },
  },
});

export const { setSearchString } = searchSlice.actions;

const selectDocumentSlice = (state: RootState) => state.search;

export const selectSearch = createSelector(selectDocumentSlice, (state) => {
  return state.searchString;
});

export default searchSlice.reducer;
