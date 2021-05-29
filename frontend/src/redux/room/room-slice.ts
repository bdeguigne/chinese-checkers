import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface RoomState {
  hasJoin: boolean;
  rooms: Room[];
  currentRoom: Room;
  hasJoinWithHomepage: boolean;
  redirectWithLink: boolean;
}

// Define the initial state using that type
const initialState: RoomState = {
  hasJoin: false,
  rooms: [],
  currentRoom: {
    _id: "",
    creatorName: "",
    players: [],
    playersCount: 0,
  },
  hasJoinWithHomepage: false,
  redirectWithLink: false,
};

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
      state.hasJoin = true;
    },
    leaveRoom: (state) => {
      state.currentRoom = {
        _id: "",
        creatorName: "",
        players: [],
        playersCount: 0,
      };
      state.hasJoin = false;
    },
    setHasJoinWithHomePage: (state, action: PayloadAction<boolean>) => {
      state.hasJoinWithHomepage = action.payload;
    },
    setRedirectWithLink: (state, action: PayloadAction<boolean>) => {
      state.redirectWithLink = action.payload;
    },
  },
});

export const { setRooms, setCurrentRoom, leaveRoom, setHasJoinWithHomePage, setRedirectWithLink } =
  roomSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRooms = (state: RootState) => state.room.rooms;
export const selectHasJoin = (state: RootState) => state.room.hasJoin;

export default roomSlice.reducer;
