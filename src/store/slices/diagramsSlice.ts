import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Diagram } from "../../services/DiagramService";

interface DiagramsState {
  diagrams: Diagram[];
  loading: boolean;
  error: string | null;
}

const initialState: DiagramsState = {
  diagrams: [],
  loading: false,
  error: null,
};

const diagramsSlice = createSlice({
  name: "diagrams",
  initialState,
  reducers: {
    setDiagrams(state, action: PayloadAction<Diagram[]>) {
      state.diagrams = action.payload;
    },
    addDiagram(state, action: PayloadAction<Diagram>) {
      state.diagrams.push(action.payload);
    },
    updateDiagramState(state, action: PayloadAction<Diagram>) {
      const index = state.diagrams.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.diagrams[index] = action.payload;
      }
    },
    deleteDiagramState(state, action: PayloadAction<string>) {
      state.diagrams = state.diagrams.filter((d) => d.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setDiagrams,
  addDiagram,
  updateDiagramState,
  deleteDiagramState,
  setLoading,
  setError,
} = diagramsSlice.actions;

export default diagramsSlice.reducer;
