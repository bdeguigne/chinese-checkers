import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface PlayerState {
  name: string;
}

// Define the initial state using that type
const initialState: PlayerState = {
  name: "default Name",
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player.name;

export default playerSlice.reducer;
