import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface GameState {
  selectedPawn: PawnAction | null;
  availableMovements: HexType[] | null;
  currentHexPosition: HexType | null;
  currentPlayerIndex: number | null;
  board: number[][][] | null;
}

// Define the initial state using that type
const initialState: GameState = {
  selectedPawn: null,
  availableMovements: null,
  currentHexPosition: null,
  currentPlayerIndex: null,
  board: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setSelectedPawn: (state, action: PayloadAction<PawnAction>) => {
      state.selectedPawn = action.payload;
    },
    setAvailableMovements: (state, action: PayloadAction<HexType[]>) => {
      state.availableMovements = action.payload;
    },
    moveFinished: (state) => {
      state.selectedPawn = null;
      state.availableMovements = null;
      state.currentHexPosition = null;
    },
    setCurrentHexPosition: (state, action: PayloadAction<HexType>) => {
      state.currentHexPosition = action.payload;
    },
    setCurrentPlayerIndex: (state, action: PayloadAction<number>) => {
      state.currentPlayerIndex = action.payload;
    },
    setBoard: (state, action: PayloadAction<number[][][]>) => {
      state.board = action.payload;
    },
  },
});

export const {
  setSelectedPawn,
  setAvailableMovements,
  moveFinished,
  setCurrentHexPosition,
  setCurrentPlayerIndex,
  setBoard,
} = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSelectedPawn = (state: RootState) => state.game.selectedPawn;
export const selectAvailableMovements = (state: RootState) =>
  state.game.availableMovements;

export default gameSlice.reducer;
