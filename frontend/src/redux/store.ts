import playerReducer from "./player/player-slice";
import roomReducer from "./room/room-slice";
import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    room: roomReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
