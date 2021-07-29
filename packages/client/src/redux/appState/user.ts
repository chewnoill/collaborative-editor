import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { User } from "../types";

interface UserState {
  me?: User;
}

// Define the initial state using that type
const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.me = payload;
    },
  },
});

export const { login } = userSlice.actions;

const selectUserSlice = (state: RootState) => state.user;

export const selectUser = createSelector(selectUserSlice, (state) => state.me);

export default userSlice.reducer;
