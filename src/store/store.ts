import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import documentsReducer from "./slices/documentsSlice";
import chatReducer from "./slices/chatSlice";
import diagramsReducer from "./slices/diagramsSlice";

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    chat: chatReducer,
    diagrams: diagramsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;