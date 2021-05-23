import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface PlayerState {
  player: Player;
}

// Define the initial state using that type
const initialState: PlayerState = {
  player: {
    _id: "",
    name: "",
    avatar: {
      seed: "",
      type: "",
    },
  },
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
    },
  },
});

export const { setPlayer } = playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player.player;

export default playerSlice.reducer;
