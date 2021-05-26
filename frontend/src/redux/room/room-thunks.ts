import { AppThunk } from "../store";
import * as roomService from "./room-service";
import { setCurrentRoom, setRooms } from "./room-slice";
import { History } from "history";
import { Routes } from "../../App";
import { findPlayerIndexInRoom } from "../player/player-thunks";

export const getAllRooms = (): AppThunk => async (dispatch) => {
  roomService
    .getAllRooms()
    .then((rooms) => dispatch(setRooms(rooms)))
    .catch((error) => console.log("get All room Error", error));
};

export const createRoom =
  (playerId: string, history: History): AppThunk =>
  async (dispatch) => {
    roomService
      .create(playerId)
      .then((room) => {
        dispatch(setCurrentRoom(room));
        dispatch(findPlayerIndexInRoom(room));
        history.push(Routes.room + "/" + room._id);
      })
      .catch((error) => console.log("create room error", error));
  };

export const getRoom =
  (roomId: string, history: History): AppThunk =>
  async (dispatch) => {
    roomService
      .getRoom(roomId)
      .then((room) => {
        dispatch(setCurrentRoom(room));
        dispatch(findPlayerIndexInRoom(room));
      })
      .catch((error) => {
        history.push(Routes.home);
        console.log("get room error", error);
      });
  };

export const addPlayer =
  (roomId: string, playerId: string, history: History): AppThunk =>
  async (dispatch) => {
    roomService
      .addPlayer(roomId, playerId)
      .then((room) => {
        dispatch(setCurrentRoom(room));
        dispatch(findPlayerIndexInRoom(room));
      })
      .catch((error) => {
        // history.push(Routes.home);
        console.log("get room error", error);
      });
  };
