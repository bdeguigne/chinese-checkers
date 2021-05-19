// import { applyMiddleware, combineReducers, createStore } from "redux";
// import thunk from "redux-thunk";
// import { playerReducer, PlayerState } from "./player/player-reducer";
import playerReducer from './player/player-slice'
import { configureStore } from '@reduxjs/toolkit'


export const store = configureStore({
    reducer:{
      player: playerReducer,
    }
  })

// const reducers = combineReducers({
//   player: playerReducer,
// });

// export const store = createStore(reducers, applyMiddleware(thunk));


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
