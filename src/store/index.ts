import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { mailsApi } from "./services/mails";
import mailsSlice from "./reducers/mailsSlice";

const rootReducer = combineReducers({
  [mailsApi.reducerPath]: mailsApi.reducer,
  mails: mailsSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mailsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
