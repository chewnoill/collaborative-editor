import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import user from "./appState/user";
import document from "./appState/document";

export const store = configureStore({
  reducer: {
    user,
    document,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function ReduxProvider(props: any) {
  return <Provider store={store} {...props} />;
}
