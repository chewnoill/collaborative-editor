import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import { Provider } from "react-redux";
import user from "./appState/user";
import document from "./appState/document";
import ydocs from "./appState/y-doc";

export const store = configureStore({
  reducer: {
    user,
    document,
    ["y-doc"]: ydocs,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function ReduxProvider(props: any) {
  return <Provider store={store} {...props} />;
}
