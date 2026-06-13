import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DocumentRecordInterface } from "../../commons/interfaces/DocumentRecordInterface";
import { mockDocuments } from "../../commons/mocks/documents";

interface DocumentsState {
  items: DocumentRecordInterface[];
}

const initialState: DocumentsState = {
  items: mockDocuments,
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<DocumentRecordInterface[]>) => {
      state.items = action.payload;
    },
    upsertDocument: (state, action: PayloadAction<DocumentRecordInterface>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        state.items[index] = action.payload;
        return;
      }

      state.items.unshift(action.payload);
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { removeDocument, upsertDocument, setDocuments } = documentsSlice.actions;
export default documentsSlice.reducer;