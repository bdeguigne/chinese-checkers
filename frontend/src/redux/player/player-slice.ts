import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface PlayerState {
  player: Player;
  playerIndex: number | null;
  guestMode: boolean;
}

// Define the initial state using that type
const initialState: PlayerState = {
  player: {
    _id: "",
    name: "",
    gameId: "",
    avatar: {
      seed: "",
      type: "",
    },
    win: 0,
    lose: 0,
  },
  playerIndex: null,
  guestMode: false,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
    },
    setPlayerIndex: (state, action: PayloadAction<number>) => {
      state.playerIndex = action.payload;
    },
    activateGuestMode: (state) => {
      state.player = {
        _id: "",
        name: "",
        gameId: "",
        avatar: {
          seed: "",
          type: "",
        },
        win: 0,
        lose: 0
      };
      state.guestMode = true;
    },
  },
});

export const { setPlayer, setPlayerIndex, activateGuestMode } =
  playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player.player;

export default playerSlice.reducer;
