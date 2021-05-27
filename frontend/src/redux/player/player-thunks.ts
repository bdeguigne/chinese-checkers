import { AppThunk } from "../store";
import { create, getPlayer as getPlayerService } from "./player-service";
import { setPlayer, setPlayerIndex } from "./player-slice";
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
  async (dispatch, getState) => {
    const guestMode = getState().player.guestMode;
    create(playerName, avatar)
      .then((player) => {
        if (guestMode === false) {
          localStorage.setItem("playerId", player._id);
        }
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

export const getPlayer =
  (playerId: string): AppThunk =>
  async (dispatch) => {
    getPlayerService(playerId).then((player) => {
      dispatch(setPlayer(player));
    });
  };

export const findPlayerIndexInRoom =
  (room: Room): AppThunk =>
  async (dispatch, getState) => {
    const playerId = getState().player.player._id;
    room.players.forEach((playerInfo) => {
      if (playerInfo.info._id === playerId) {
        dispatch(setPlayerIndex(playerInfo.playerIndex));
      }
    });
  };
