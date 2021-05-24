import { AppThunk } from "../store";
import { create } from "./player-service";
import { setPlayer } from "./player-slice";
import { History } from "history";
import { Routes } from "../../App";
import { createRoom } from "../room/room-thunks";

export const createPlayer =
  (
    playerName: string,
    avatar: Avatar,
    route: Routes,
    history: History
  ): AppThunk =>
  async (dispatch) => {
    create(playerName, avatar)
      .then((player) => {
        dispatch(setPlayer(player));
        if (route === Routes.room) {
          dispatch(createRoom(player._id, history));
        }
        if (route === Routes.rooms) {
          history.push(route);
        }
      })
      .catch((error) => console.log("Create Player Error", error));
  };